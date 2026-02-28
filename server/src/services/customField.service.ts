import db from '../db/connection';
import { CreateCustomFieldInput, UpdateCustomFieldInput } from '../types/customField';
import { AppError } from '../utils/errors';

export class CustomFieldService {
  async list(userId: string) {
    return await db('custom_field_definitions')
      .where('user_id', userId)
      .orderBy('sort_order', 'asc')
      .orderBy('name', 'asc');
  }

  async create(userId: string, input: CreateCustomFieldInput) {
    try {
      const [field] = await db('custom_field_definitions')
        .insert({
          user_id: userId,
          name: input.name,
          field_type: input.fieldType,
          options: JSON.stringify(input.options || []),
          default_value: input.defaultValue || null,
          sort_order: input.sortOrder || 0,
        })
        .returning('*');
      return field;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new AppError(409, 'Custom field with this name already exists');
      }
      throw error;
    }
  }

  async update(userId: string, fieldId: string, input: UpdateCustomFieldInput) {
    const field = await db('custom_field_definitions')
      .where('id', fieldId)
      .where('user_id', userId)
      .first();

    if (!field) {
      throw new AppError(404, 'Custom field not found');
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.fieldType !== undefined) updateData.field_type = input.fieldType;
    if (input.options !== undefined) updateData.options = JSON.stringify(input.options);
    if (input.defaultValue !== undefined) updateData.default_value = input.defaultValue;
    if (input.sortOrder !== undefined) updateData.sort_order = input.sortOrder;

    try {
      const [updated] = await db('custom_field_definitions')
        .where('id', fieldId)
        .update(updateData)
        .returning('*');
      return updated;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new AppError(409, 'Custom field with this name already exists');
      }
      throw error;
    }
  }

  async delete(userId: string, fieldId: string) {
    const field = await db('custom_field_definitions')
      .where('id', fieldId)
      .where('user_id', userId)
      .first();

    if (!field) {
      throw new AppError(404, 'Custom field not found');
    }

    await db('custom_field_values').where('field_id', fieldId).delete();
    await db('custom_field_definitions').where('id', fieldId).delete();
    
    return { success: true };
  }
}

export const customFieldService = new CustomFieldService();
