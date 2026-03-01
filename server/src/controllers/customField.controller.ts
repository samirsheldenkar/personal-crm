import { Request, Response } from 'express';
import { customFieldService } from '../services/customField.service';
import { createCustomFieldSchema, updateCustomFieldSchema } from '../types/customField';

export async function list(req: Request, res: Response) {
  const userId = req.user!.userId;
  const fields = await customFieldService.list(userId);
  res.json(fields);
}

export async function create(req: Request, res: Response) {
  const userId = req.user!.userId;
  const input = createCustomFieldSchema.parse(req.body);

  const field = await customFieldService.create(userId, input);
  res.status(201).json(field);
}

export async function update(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const input = updateCustomFieldSchema.parse(req.body);

  const field = await customFieldService.update(userId, id as string, input);
  res.json(field);
}

export async function remove(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  await customFieldService.delete(userId, id as string);
  res.status(204).send();
}
