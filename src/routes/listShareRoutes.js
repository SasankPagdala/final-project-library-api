import express from 'express';
import {
  getListShares,
  getSharedWithMe,
  createListShare,
  updateListShare,
  deleteListShare,
} from '../controllers/listShareController.js';
import { authenticate } from '../middleware/authenticate.js';
import { checkListPermission } from '../middleware/checkListPermission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get lists shared with the current user
router.get('/shared-with-me', getSharedWithMe);

// Get all shares for a specific list (owner only)
router.get(
  '/lists/:listId/shares',
  checkListPermission('VIEW'),
  getListShares
);

// Share a list with a user (owner only)
router.post(
  '/lists/:listId/shares',
  checkListPermission('EDIT'),
  createListShare
);

// Update share permission (owner only)
router.put(
  '/lists/:listId/shares/:shareId',
  checkListPermission('EDIT'),
  updateListShare
);

// Remove a share (owner only)
router.delete(
  '/lists/:listId/shares/:shareId',
  checkListPermission('EDIT'),
  deleteListShare
);

export default router;
