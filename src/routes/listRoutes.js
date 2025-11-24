import express from 'express';
import {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
} from '../controllers/listController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// All list routes require a valid JWT
router.use(authenticate);

//GET /lists
router.get('/', getLists);

//GET /lists/:id
router.get('/:id', getListById);

//POST /lists
router.post('/', createList);

//PUT /lists/:id
router.put('/:id', updateList);

//DELETE /lists/:id
router.delete('/:id', deleteList);

export default router;