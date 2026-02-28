import { Request, Response } from 'express';
import { noteService } from '../services/note.service';
import { createNoteSchema, updateNoteSchema } from '../types/note';
import { AppError } from '../utils/errors';

export async function listByContact(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { contactId } = req.params;
    
    const notes = await noteService.listByContact(userId, contactId as string);
    res.json(notes);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { contactId } = req.params;
    const input = createNoteSchema.parse(req.body);
    
    const note = await noteService.create(userId, contactId as string, input);
    res.status(201).json(note);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const input = updateNoteSchema.parse(req.body);
    
    const note = await noteService.update(userId, id as string, input);
    res.json(note);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    
    await noteService.delete(userId, id as string);
    res.status(204).send();
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
