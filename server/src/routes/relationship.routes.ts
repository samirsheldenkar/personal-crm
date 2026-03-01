import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { list, create, remove, getGraph } from '../controllers/relationship.controller';
import { wrapAsync } from '../utils/wrapAsync';

const router = Router();

router.use(authenticate);

router.get('/', wrapAsync(list));
router.post('/', wrapAsync(create));
router.delete('/:id', wrapAsync(remove));
router.get('/graph/:id', wrapAsync(getGraph));

export default router;
