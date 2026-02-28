import db from '../db/connection';
import { CreateRelationshipInput, GraphNode, GraphEdge, ContactGraph } from '../types/relationship';
import { AppError } from '../utils/errors';

export class RelationshipService {
  async create(userId: string, input: CreateRelationshipInput) {
    if (input.fromContactId === input.toContactId) {
      throw new AppError(400, 'Cannot create relationship to self');
    }

    const fromContact = await db('contacts')
      .where('id', input.fromContactId)
      .where('user_id', userId)
      .first();

    if (!fromContact) {
      throw new AppError(404, 'Source contact not found');
    }

    const toContact = await db('contacts')
      .where('id', input.toContactId)
      .where('user_id', userId)
      .first();

    if (!toContact) {
      throw new AppError(404, 'Target contact not found');
    }

    const existing = await db('relationships')
      .where('user_id', userId)
      .where('from_contact_id', input.fromContactId)
      .where('to_contact_id', input.toContactId)
      .first();

    if (existing) {
      throw new AppError(409, 'Relationship already exists');
    }

    const [relationship] = await db('relationships')
      .insert({
        user_id: userId,
        from_contact_id: input.fromContactId,
        to_contact_id: input.toContactId,
        type: input.type,
        metadata: JSON.stringify(input.metadata || {}),
      })
      .returning('*');

    return relationship;
  }

  async list(userId: string, contactId?: string) {
    let query = db('relationships')
      .where('relationships.user_id', userId)
      .join('contacts as from_contact', 'relationships.from_contact_id', 'from_contact.id')
      .join('contacts as to_contact', 'relationships.to_contact_id', 'to_contact.id')
      .select(
        'relationships.*',
        'from_contact.first_name as from_first_name',
        'from_contact.last_name as from_last_name',
        'to_contact.first_name as to_first_name',
        'to_contact.last_name as to_last_name'
      );

    if (contactId) {
      query = query.where(function() {
        this.where('relationships.from_contact_id', contactId)
            .orWhere('relationships.to_contact_id', contactId);
      });
    }

    return await query.orderBy('relationships.created_at', 'desc');
  }

  async delete(userId: string, relationshipId: string) {
    const existing = await db('relationships')
      .where('id', relationshipId)
      .where('user_id', userId)
      .first();

    if (!existing) {
      throw new AppError(404, 'Relationship not found');
    }

    await db('relationships').where('id', relationshipId).delete();
    return { success: true };
  }

  async getGraph(userId: string, contactId: string): Promise<ContactGraph> {
    const centerContact = await db('contacts')
      .where('id', contactId)
      .where('user_id', userId)
      .first();

    if (!centerContact) {
      throw new AppError(404, 'Contact not found');
    }

    const relationships = await db('relationships')
      .where('relationships.user_id', userId)
      .where(function() {
        this.where('relationships.from_contact_id', contactId)
            .orWhere('relationships.to_contact_id', contactId);
      })
      .select('relationships.*');

    const relatedContactIds = new Set<string>();
    relationships.forEach(rel => {
      relatedContactIds.add(rel.from_contact_id);
      relatedContactIds.add(rel.to_contact_id);
    });

    const contactIds = Array.from(relatedContactIds);

    let contacts: any[] = [];
    if (contactIds.length > 0) {
      contacts = await db('contacts')
        .whereIn('contacts.id', contactIds)
        .where('contacts.user_id', userId)
        .select('contacts.*');

      const contactTags = await db('tags')
        .select('tags.*', 'contact_tags.contact_id')
        .join('contact_tags', 'tags.id', 'contact_tags.tag_id')
        .whereIn('contact_tags.contact_id', contactIds);

      const tagsByContact = contactTags.reduce((acc, tag) => {
        if (!acc[tag.contact_id]) acc[tag.contact_id] = [];
        acc[tag.contact_id].push({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        });
        return acc;
      }, {} as Record<string, any[]>);

      contacts = contacts.map(contact => ({
        ...contact,
        tags: tagsByContact[contact.id] || [],
      }));
    }

    const nodes: GraphNode[] = contacts.map(contact => ({
      id: contact.id,
      firstName: contact.first_name,
      lastName: contact.last_name,
      avatarUrl: contact.avatar_url,
      company: contact.company,
      jobTitle: contact.job_title,
      tags: contact.tags || [],
    }));

    const edges: GraphEdge[] = relationships.map(rel => ({
      id: rel.id,
      source: rel.from_contact_id,
      target: rel.to_contact_id,
      type: rel.type,
    }));

    return {
      nodes,
      edges,
      centerId: contactId,
    };
  }
}

export const relationshipService = new RelationshipService();
