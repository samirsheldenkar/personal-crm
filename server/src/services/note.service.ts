import db from '../db/connection';
import { CreateNoteInput, UpdateNoteInput } from '../types/note';
import { AppError } from '../utils/errors';

export class NoteService {
  async listByContact(userId: string, contactId: string) {
    const contact = await db('contacts')
      .where('id', contactId)
      .where('user_id', userId)
      .first();

    if (!contact) {
      throw new AppError(404, 'Contact not found');
    }

    return await db('notes')
      .where('contact_id', contactId)
      .orderBy('created_at', 'desc');
  }

  async create(userId: string, contactId: string, input: CreateNoteInput) {
    const contact = await db('contacts')
      .where('id', contactId)
      .where('user_id', userId)
      .first();

    if (!contact) {
      throw new AppError(404, 'Contact not found');
    }

    const [note] = await db('notes')
      .insert({
        contact_id: contactId,
        user_id: userId,
        body: input.body,
        format: input.format || 'markdown',
        tags: JSON.stringify(input.tags || []),
      })
      .returning('*');

    return note;
  }

  async update(userId: string, noteId: string, input: UpdateNoteInput) {
    const note = await db('notes')
      .where('id', noteId)
      .where('user_id', userId)
      .first();

    if (!note) {
      throw new AppError(404, 'Note not found');
    }

    const updateData: any = {};
    if (input.body !== undefined) updateData.body = input.body;
    if (input.format !== undefined) updateData.format = input.format;
    if (input.tags !== undefined) updateData.tags = JSON.stringify(input.tags);
    updateData.updated_at = new Date();

    const [updated] = await db('notes')
      .where('id', noteId)
      .update(updateData)
      .returning('*');

    return updated;
  }

  async delete(userId: string, noteId: string) {
    const note = await db('notes')
      .where('id', noteId)
      .where('user_id', userId)
      .first();

    if (!note) {
      throw new AppError(404, 'Note not found');
    }

    await db('notes').where('id', noteId).delete();
    return { success: true };
  }
}

export const noteService = new NoteService();
