import db from '../db/connection';
import { CreateReminderInput, UpdateReminderInput } from '../types/reminder';
import { AppError } from '../utils/errors';

export class ReminderService {
  async list(userId: string) {
    return await db('reminders')
      .where('user_id', userId)
      .where('is_completed', false)
      .where(function() {
        this.whereNull('due_date').orWhere('due_date', '>=', new Date().toISOString().split('T')[0]);
      })
      .orderBy('due_date', 'asc')
      .select('*');
  }

  async create(userId: string, input: CreateReminderInput) {
    const contact = await db('contacts')
      .where('id', input.contactId)
      .where('user_id', userId)
      .first();

    if (!contact) {
      throw new AppError(404, 'Contact not found');
    }

    let dueDate: string | null = null;
    
    if (input.type === 'keep_in_touch' && input.intervalDays) {
      const date = new Date();
      date.setDate(date.getDate() + input.intervalDays);
      dueDate = date.toISOString().split('T')[0];
    } else if (input.type === 'one_time' && input.dueDate) {
      dueDate = input.dueDate;
    }

    const [reminder] = await db('reminders')
      .insert({
        contact_id: input.contactId,
        user_id: userId,
        type: input.type,
        interval_days: input.intervalDays || null,
        due_date: dueDate,
        note: input.note || null,
        is_completed: false,
      })
      .returning('*');

    return reminder;
  }

  async update(userId: string, reminderId: string, input: UpdateReminderInput) {
    const reminder = await db('reminders')
      .where('id', reminderId)
      .where('user_id', userId)
      .first();

    if (!reminder) {
      throw new AppError(404, 'Reminder not found');
    }

    const updateData: any = {};
    
    if (input.intervalDays !== undefined) {
      updateData.interval_days = input.intervalDays;
      if (reminder.type === 'keep_in_touch' && input.intervalDays) {
        const date = new Date();
        date.setDate(date.getDate() + input.intervalDays);
        updateData.due_date = date.toISOString().split('T')[0];
      }
    }
    
    if (input.dueDate !== undefined) {
      updateData.due_date = input.dueDate;
    }
    
    if (input.note !== undefined) {
      updateData.note = input.note;
    }
    
    if (input.isCompleted !== undefined) {
      updateData.is_completed = input.isCompleted;
    }

    const [updated] = await db('reminders')
      .where('id', reminderId)
      .update(updateData)
      .returning('*');

    return updated;
  }

  async delete(userId: string, reminderId: string) {
    const reminder = await db('reminders')
      .where('id', reminderId)
      .where('user_id', userId)
      .first();

    if (!reminder) {
      throw new AppError(404, 'Reminder not found');
    }

    await db('reminders').where('id', reminderId).delete();
    return { success: true };
  }
}

export const reminderService = new ReminderService();
