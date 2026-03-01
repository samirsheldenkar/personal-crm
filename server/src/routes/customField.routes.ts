import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { list, create, update, remove } from '../controllers/customField.controller';
import { wrapAsync } from '../utils/wrapAsync';

const router = Router();

router.use(authenticate);

router.get('/', wrapAsync(list));
router.post('/', wrapAsync(create));
router.patch('/:id', wrapAsync(update));
router.delete('/:id', wrapAsync(remove));

export default router;
