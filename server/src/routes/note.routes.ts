import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { listByContact, create, update, remove } from '../controllers/note.controller';

const router = Router();

router.use(authenticate);

router.get('/contact/:contactId', listByContact);
router.post('/contact/:contactId', create);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router;
