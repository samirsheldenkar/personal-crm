import { Router } from 'express';
import { register, login, refresh } from '../controllers/auth.controller';
import { wrapAsync } from '../utils/wrapAsync';

const router = Router();

router.post('/register', wrapAsync(register));
router.post('/login', wrapAsync(login));
router.post('/refresh', wrapAsync(refresh));

export default router;
