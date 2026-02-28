import db from '../db/connection';
import { CreateContactInput, UpdateContactInput, ContactRow } from '../types/contact';
import { AppError } from '../utils/errors';

export class ContactService {
  async list(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      search?: string;
      tags?: string[];
      sort?: string;
      order?: 'asc' | 'desc';
      archived?: boolean;
    }
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    let query = db('contacts')
      .where('user_id', userId)
      .where('is_archived', options.archived || false);

    if (options.search) {
      query = query.whereRaw('search_vector @@ plainto_tsquery(?)', [options.search]);
    }

    if (options.tags && options.tags.length > 0) {
      query = query.whereExists(function() {
        this.select('*')
          .from('contact_tags')
          .whereRaw('contact_tags.contact_id = contacts.id')
          .whereIn('contact_tags.tag_id', options.tags!);
      });
    }

    const countResult = await query.clone().count('* as count').first();
    const total = parseInt(countResult?.count as string, 10);

    const sortColumn = options.sort === 'created_at' ? 'created_at' : 
                       options.sort === 'last_contacted_at' ? 'last_contacted_at' : 
                       'first_name';
    const sortOrder = options.order || 'asc';

    const contacts = await query
      .select('*')
      .orderBy(sortColumn, sortOrder)
      .limit(limit)
      .offset(offset);

    return {
      contacts,
      total,
      page,
      limit,
    };
  }

  async getById(userId: string, contactId: string) {
    const contact = await db('contacts')
      .where('id', contactId)
      .where('user_id', userId)
      .first();

    if (!contact) {
      throw new AppError(404, 'Contact not found');
    }

    const tags = await db('tags')
      .select('tags.*')
      .join('contact_tags', 'tags.id', 'contact_tags.tag_id')
      .where('contact_tags.contact_id', contactId);

    const customFields = await db('custom_field_values')
      .select('custom_field_definitions.name', 'custom_field_values.value')
      .join('custom_field_definitions', 'custom_field_values.field_id', 'custom_field_definitions.id')
      .where('custom_field_values.contact_id', contactId);

    return {
      ...contact,
      tags,
      customFields,
    };
  }

  async create(userId: string, input: CreateContactInput) {
    const contactData: any = {
      user_id: userId,
      first_name: input.firstName,
      last_name: input.lastName || null,
      avatar_url: input.avatarUrl || null,
      company: input.company || null,
      job_title: input.jobTitle || null,
      birthday: input.birthday || null,
      emails: JSON.stringify(input.emails || []),
      phones: JSON.stringify(input.phones || []),
      addresses: JSON.stringify(input.addresses || []),
      social_links: JSON.stringify(input.socialLinks || {}),
    };

    const [contact] = await db('contacts').insert(contactData).returning('*');

    if (input.tagIds && input.tagIds.length > 0) {
      const contactTags = input.tagIds.map(tagId => ({
        contact_id: contact.id,
        tag_id: tagId,
      }));
      await db('contact_tags').insert(contactTags);
    }

    if (input.customFields && Object.keys(input.customFields).length > 0) {
      const customFieldValues = Object.entries(input.customFields).map(([fieldId, value]) => ({
        contact_id: contact.id,
        field_id: fieldId,
        value: String(value),
      }));
      await db('custom_field_values').insert(customFieldValues);
    }

    return contact;
  }

  async update(userId: string, contactId: string, input: UpdateContactInput) {
    const existing = await db('contacts')
      .where('id', contactId)
      .where('user_id', userId)
      .first();

    if (!existing) {
      throw new AppError(404, 'Contact not found');
    }

    const updateData: any = {};
    if (input.firstName !== undefined) updateData.first_name = input.firstName;
    if (input.lastName !== undefined) updateData.last_name = input.lastName || null;
    if (input.avatarUrl !== undefined) updateData.avatar_url = input.avatarUrl || null;
    if (input.company !== undefined) updateData.company = input.company || null;
    if (input.jobTitle !== undefined) updateData.job_title = input.jobTitle || null;
    if (input.birthday !== undefined) updateData.birthday = input.birthday || null;
    if (input.emails !== undefined) updateData.emails = JSON.stringify(input.emails);
    if (input.phones !== undefined) updateData.phones = JSON.stringify(input.phones);
    if (input.addresses !== undefined) updateData.addresses = JSON.stringify(input.addresses);
    if (input.socialLinks !== undefined) updateData.social_links = JSON.stringify(input.socialLinks);
    updateData.updated_at = new Date();

    const [contact] = await db('contacts')
      .where('id', contactId)
      .update(updateData)
      .returning('*');

    if (input.tagIds !== undefined) {
      await db('contact_tags').where('contact_id', contactId).delete();
      if (input.tagIds.length > 0) {
        const contactTags = input.tagIds.map(tagId => ({
          contact_id: contactId,
          tag_id: tagId,
        }));
        await db('contact_tags').insert(contactTags);
      }
    }

    return contact;
  }

  async delete(userId: string, contactId: string) {
    const existing = await db('contacts')
      .where('id', contactId)
      .where('user_id', userId)
      .first();

    if (!existing) {
      throw new AppError(404, 'Contact not found');
    }

    await db('contacts').where('id', contactId).delete();
    return { success: true };
  }

  async archive(userId: string, contactId: string, archived: boolean) {
    const existing = await db('contacts')
      .where('id', contactId)
      .where('user_id', userId)
      .first();

    if (!existing) {
      throw new AppError(404, 'Contact not found');
    }

    const [contact] = await db('contacts')
      .where('id', contactId)
      .update({ is_archived: archived, updated_at: new Date() })
      .returning('*');

    return contact;
  }

  async getTimeline(userId: string, contactId: string) {
    const contact = await db('contacts')
      .where('id', contactId)
      .where('user_id', userId)
      .first();

    if (!contact) {
      throw new AppError(404, 'Contact not found');
    }

    const notes = await db('notes')
      .where('contact_id', contactId)
      .orderBy('created_at', 'desc')
      .select('*');

    const reminders = await db('reminders')
      .where('contact_id', contactId)
      .orderBy('due_date', 'asc')
      .select('*');

    const timeline = [
      ...notes.map(n => ({ type: 'note' as const, date: n.created_at, data: n })),
      ...reminders.map(r => ({ type: 'reminder' as const, date: r.due_date || r.created_at, data: r })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { notes, reminders, timeline };
  }
}

export const contactService = new ContactService();
