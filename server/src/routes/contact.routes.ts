import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  list,
  getById,
  create,
  update,
  remove,
  archive,
  getTimeline,
} from '../controllers/contact.controller';
import { wrapAsync } from '../utils/wrapAsync';

const router = Router();

router.use(authenticate);

router.get('/', wrapAsync(list));
router.post('/', wrapAsync(create));
router.get('/:id', wrapAsync(getById));
router.patch('/:id', wrapAsync(update));
router.delete('/:id', wrapAsync(remove));
router.post('/:id/archive', wrapAsync(archive));
router.get('/:id/timeline', wrapAsync(getTimeline));

export default router;
