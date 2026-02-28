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

const router = Router();

router.use(authenticate);

router.get('/', list);
router.post('/', create);
router.get('/:id', getById);
router.patch('/:id', update);
router.delete('/:id', remove);
router.post('/:id/archive', archive);
router.get('/:id/timeline', getTimeline);

export default router;
