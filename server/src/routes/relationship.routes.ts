import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { list, create, remove, getGraph } from '../controllers/relationship.controller';

const router = Router();

router.use(authenticate);

router.get('/', list);
router.post('/', create);
router.delete('/:id', remove);
router.get('/graph/:id', getGraph);

export default router;
