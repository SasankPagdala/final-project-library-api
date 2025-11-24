import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

//All item routes require valid JWT
router.use(authenticate);

//READ: any authenticated user
router.get('/', getItems);
router.get('/:id', getItemById);

//WRITE: admin only
router.post('/', authorizeRoles('ADMIN'), createItem);
router.put('/:id', authorizeRoles('ADMIN'), updateItem);
router.delete('/:id', authorizeRoles('ADMIN'), deleteItem);

export default router;
