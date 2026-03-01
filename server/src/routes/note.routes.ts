import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { listByContact, listRecent, create, update, remove } from '../controllers/note.controller';
import { wrapAsync } from '../utils/wrapAsync';

const router = Router();

router.use(authenticate);

router.get('/recent', wrapAsync(listRecent));
router.get('/contact/:contactId', wrapAsync(listByContact));
router.post('/contact/:contactId', wrapAsync(create));
router.patch('/:id', wrapAsync(update));
router.delete('/:id', wrapAsync(remove));

export default router;
