import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { list, create, update, remove } from '../controllers/customField.controller';

const router = Router();

router.use(authenticate);

router.get('/', list);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router;
