import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { list, create, update, remove, assignToContact, removeFromContact } from '../controllers/tag.controller';

const router = Router();

router.use(authenticate);

router.get('/', list);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);
router.post('/assign/:contactId', assignToContact);
router.delete('/assign/:contactId/:tagId', removeFromContact);

export default router;
