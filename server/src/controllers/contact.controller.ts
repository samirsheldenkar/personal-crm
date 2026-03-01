import { Request, Response } from 'express';
import { contactService } from '../services/contact.service';
import { createContactSchema, updateContactSchema, listContactsQuery } from '../types/contact';

export async function list(req: Request, res: Response) {
  const userId = req.user!.userId;
  const query = listContactsQuery.parse(req.query);

  const result = await contactService.list(userId, {
    page: query.page,
    limit: query.limit,
    search: query.search,
    tags: query.tags ? query.tags.split(',') : undefined,
    sort: query.sort,
    order: query.order,
    archived: query.archived,
  });

  res.json(result);
}

export async function getById(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const contact = await contactService.getById(userId, id as string);
  res.json(contact);
}

export async function create(req: Request, res: Response) {
  const userId = req.user!.userId;
  const input = createContactSchema.parse(req.body);

  const contact = await contactService.create(userId, input);
  res.status(201).json(contact);
}

export async function update(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const input = updateContactSchema.parse(req.body);

  const contact = await contactService.update(userId, id as string, input);
  res.json(contact);
}

export async function remove(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  await contactService.delete(userId, id as string);
  res.status(204).send();
}

export async function archive(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { archived } = req.body;

  const contact = await contactService.archive(userId, id as string, archived);
  res.json(contact);
}

export async function getTimeline(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const timeline = await contactService.getTimeline(userId, id as string);
  res.json(timeline);
}
