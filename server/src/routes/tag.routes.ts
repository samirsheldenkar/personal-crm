import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { list, create, update, remove, assignToContact, removeFromContact } from '../controllers/tag.controller';
import { wrapAsync } from '../utils/wrapAsync';

const router = Router();

router.use(authenticate);

router.get('/', wrapAsync(list));
router.post('/', wrapAsync(create));
router.patch('/:id', wrapAsync(update));
router.delete('/:id', wrapAsync(remove));
router.post('/assign/:contactId', wrapAsync(assignToContact));
router.delete('/assign/:contactId/:tagId', wrapAsync(removeFromContact));

export default router;
