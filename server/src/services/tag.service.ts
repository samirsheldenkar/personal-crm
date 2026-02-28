import db from '../db/connection';
import { CreateTagInput, UpdateTagInput } from '../types/tag';
import { AppError } from '../utils/errors';

export class TagService {
  async list(userId: string) {
    return await db('tags')
      .where('user_id', userId)
      .orderBy('name', 'asc');
  }

  async create(userId: string, input: CreateTagInput) {
    try {
      const [tag] = await db('tags')
        .insert({
          user_id: userId,
          name: input.name,
          color: input.color,
        })
        .returning('*');
      return tag;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new AppError(409, 'Tag with this name already exists');
      }
      throw error;
    }
  }

  async update(userId: string, tagId: string, input: UpdateTagInput) {
    const tag = await db('tags')
      .where('id', tagId)
      .where('user_id', userId)
      .first();

    if (!tag) {
      throw new AppError(404, 'Tag not found');
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.color !== undefined) updateData.color = input.color;

    try {
      const [updated] = await db('tags')
        .where('id', tagId)
        .update(updateData)
        .returning('*');
      return updated;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new AppError(409, 'Tag with this name already exists');
      }
      throw error;
    }
  }

  async delete(userId: string, tagId: string) {
    const tag = await db('tags')
      .where('id', tagId)
      .where('user_id', userId)
      .first();

    if (!tag) {
      throw new AppError(404, 'Tag not found');
    }

    await db('tags').where('id', tagId).delete();
    return { success: true };
  }

  async assignToContact(userId: string, contactId: string, tagIds: string[]) {
    const contact = await db('contacts')
      .where('id', contactId)
      .where('user_id', userId)
      .first();

    if (!contact) {
      throw new AppError(404, 'Contact not found');
    }

    const existingTags = await db('tags')
      .whereIn('id', tagIds)
      .where('user_id', userId);

    if (existingTags.length !== tagIds.length) {
      throw new AppError(400, 'One or more tags not found');
    }

    await db('contact_tags')
      .where('contact_id', contactId)
      .whereIn('tag_id', tagIds)
      .delete();

    const contactTags = tagIds.map(tagId => ({
      contact_id: contactId,
      tag_id: tagId,
    }));

    await db('contact_tags').insert(contactTags);

    return await db('tags')
      .select('tags.*')
      .join('contact_tags', 'tags.id', 'contact_tags.tag_id')
      .where('contact_tags.contact_id', contactId);
  }

  async removeFromContact(userId: string, contactId: string, tagId: string) {
    const contact = await db('contacts')
      .where('id', contactId)
      .where('user_id', userId)
      .first();

    if (!contact) {
      throw new AppError(404, 'Contact not found');
    }

    await db('contact_tags')
      .where('contact_id', contactId)
      .where('tag_id', tagId)
      .delete();

    return { success: true };
  }
}

export const tagService = new TagService();
