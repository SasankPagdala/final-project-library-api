import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

//All category operations require authentication
router.use(authenticate);

//READ: any authenticated user
router.get('/', getCategories);
router.get('/:id', getCategoryById);

//WRITE: admin only
router.post('/', authorizeRoles('ADMIN'), createCategory);
router.put('/:id', authorizeRoles('ADMIN'), updateCategory);
router.delete('/:id', authorizeRoles('ADMIN'), deleteCategory);

export default router;
