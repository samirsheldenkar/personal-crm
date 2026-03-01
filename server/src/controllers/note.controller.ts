import { Request, Response } from 'express';
import { noteService } from '../services/note.service';
import { createNoteSchema, updateNoteSchema } from '../types/note';

export async function listByContact(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { contactId } = req.params;

  const notes = await noteService.listByContact(userId, contactId as string);
  res.json(notes);
}

export async function create(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { contactId } = req.params;
  const input = createNoteSchema.parse(req.body);

  const note = await noteService.create(userId, contactId as string, input);
  res.status(201).json(note);
}

export async function update(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const input = updateNoteSchema.parse(req.body);

  const note = await noteService.update(userId, id as string, input);
  res.json(note);
}

export async function remove(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  await noteService.delete(userId, id as string);
  res.status(204).send();
}
