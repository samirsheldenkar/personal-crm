import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { search } from '../controllers/search.controller';
import { wrapAsync } from '../utils/wrapAsync';

const router = Router();

router.use(authenticate);

router.get('/', wrapAsync(search));

export default router;
