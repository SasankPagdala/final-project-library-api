import * as itemService from '../services/itemService.js';

export async function getItems(req, res, next) {
  try {
    const items = await itemService.getAllItems();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
}

export async function getItemById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['ID must be a number'],
      });
    }

    const item = await itemService.getItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

export async function createItem(req, res, next) {
  try {
    const { name, defaultUnit, categoryId } = req.body;

    const errors = [];
    if (!name || typeof name !== 'string') {
      errors.push('name is required and must be a string');
    }
    if (categoryId == null || Number.isNaN(Number(categoryId))) {
      errors.push('categoryId is required and must be a number');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    const item = await itemService.createItem({
      name,
      defaultUnit,
      categoryId: Number(categoryId),
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['ID must be a number'],
      });
    }

    const { name, defaultUnit, categoryId } = req.body;

    const item = await itemService.updateItem(id, {
      name,
      defaultUnit,
      categoryId,
    });

    res.status(200).json(item);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['ID must be a number'],
      });
    }

    await itemService.deleteItem(id);
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    next(err);
  }
}
