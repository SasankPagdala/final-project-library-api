import * as listShareService from '../services/listShareService.js';

export async function getListShares(req, res, next) {
  try {
    const listId = parseInt(req.params.listId, 10);
    if (Number.isNaN(listId)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['listId must be a number'],
      });
    }

    const shares = await listShareService.getListShares(listId);
    res.status(200).json(shares);
  } catch (err) {
    next(err);
  }
}

export async function getSharedWithMe(req, res, next) {
  try {
    const userId = req.user.id;
    const shares = await listShareService.getSharedWithMe(userId);
    res.status(200).json(shares);
  } catch (err) {
    next(err);
  }
}

export async function createListShare(req, res, next) {
  try {
    const listId = parseInt(req.params.listId, 10);
    if (Number.isNaN(listId)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['listId must be a number'],
      });
    }

    const { sharedWithUserId, permissionLevel } = req.body;

    const errors = [];
    if (
      sharedWithUserId == null ||
      Number.isNaN(Number(sharedWithUserId))
    ) {
      errors.push('sharedWithUserId is required and must be a number');
    }
    if (
      permissionLevel &&
      permissionLevel !== 'VIEW' &&
      permissionLevel !== 'EDIT'
    ) {
      errors.push('permissionLevel must be either VIEW or EDIT');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    const share = await listShareService.createListShare({
      listId,
      sharedWithUserId: Number(sharedWithUserId),
      permissionLevel: permissionLevel || 'VIEW',
    });

    res.status(201).json(share);
  } catch (err) {
    next(err);
  }
}

export async function updateListShare(req, res, next) {
  try {
    const id = parseInt(req.params.shareId, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['shareId must be a number'],
      });
    }

    const { permissionLevel } = req.body;

    const errors = [];
    if (!permissionLevel) {
      errors.push('permissionLevel is required');
    } else if (permissionLevel !== 'VIEW' && permissionLevel !== 'EDIT') {
      errors.push('permissionLevel must be either VIEW or EDIT');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    const share = await listShareService.updateListShare(id, {
      permissionLevel,
    });

    res.status(200).json(share);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Share not found' });
    }
    next(err);
  }
}

export async function deleteListShare(req, res, next) {
  try {
    const id = parseInt(req.params.shareId, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['shareId must be a number'],
      });
    }

    await listShareService.deleteListShare(id);
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Share not found' });
    }
    next(err);
  }
}
