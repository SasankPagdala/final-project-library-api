import * as listService from '../services/listService.js';

export async function getLists(req, res, next) {
  try {
    const lists = await listService.getListsForUser(req.user);
    res.status(200).json(lists);
  } catch (err) {
    next(err);
  }
}

export async function getListById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['ID must be a number'],
      });
    }

    const list = await listService.getListByIdForUser(id, req.user);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
}

export async function createList(req, res, next) {
  try {
    const { name, description, isActive } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['name is required and must be a string'],
      });
    }

    const list = await listService.createListForUser(req.user, {
      name,
      description,
      isActive,
    });

    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
}

export async function updateList(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['ID must be a number'],
      });
    }

    const { name, description, isActive } = req.body;

    const updated = await listService.updateListForUser(id, req.user, {
      name,
      description,
      isActive,
    });

    if (!updated) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteList(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['ID must be a number'],
      });
    }

    const deleted = await listService.deleteListForUser(id, req.user);
    if (!deleted) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}