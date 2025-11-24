import express from 'express';
import { register, login, getMe, changePassword, resetPassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

//POST /auth/register
router.post('/register', register);

//POST /auth/login
router.post('/login', login);

//GET /auth/me  (current logged-in user)
router.get('/me', authenticate, getMe);

// change password (authenticated)
router.post('/change-password', authenticate, changePassword);

// reset password (unauthenticated, but needs valid token)
router.post('/reset-password', resetPassword);

export default router;
