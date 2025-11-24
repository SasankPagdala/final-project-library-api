// src/routes/userRoutes.js
import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import {
  getUserProfile,
  updateUser,
  deleteUser, 
  resetUserPasswordByAdmin
} from '../controllers/userController.js';

const router = express.Router();

// GET /users/:id  – view profile (self or admin)
router.get('/:id', authenticate, getUserProfile);

// PUT /users/:id  – update profile (self or admin)
router.put('/:id', authenticate, updateUser);

// DELETE /users/:id – delete account (self or admin)
router.delete('/:id', authenticate, deleteUser);

// admin-only reset password for a user
router.put('/:id/reset-password',
  authenticate,
  authorizeRoles('ADMIN'),
  resetUserPasswordByAdmin
);

export default router;
