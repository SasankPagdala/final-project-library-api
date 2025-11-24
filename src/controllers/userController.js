// src/controllers/userController.js
import * as userService from '../services/userService.js';

export async function getUserProfile(req, res, next) {
  try {
    const requestedId = parseInt(req.params.id, 10);
    const authUser = req.user; // set by authenticate middleware
    const authUserId = Number(authUser.id); // important: normalize type

    // Only self or admin
    if (authUser.role !== 'ADMIN' && authUser.id !== requestedId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await userService.getUserById(requestedId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const requestedId = parseInt(req.params.id, 10);
    const authUser = req.user;
    const authUserId = Number(authUser.id); // important: normalize type


    if (authUser.role !== 'ADMIN' && authUser.id !== requestedId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if ('password' in req.body || 'passwordHash' in req.body) {
      return res.status(400).json({
        error: 'Password cannot be updated via this endpoint',
      });
    }

    // Make sure password can’t be updated here
    const { password, passwordHash, ...safeData } = req.body;

    // Reject request if nothing to update
    if (Object.keys(safeData).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const updated = await userService.updateUser(requestedId, safeData);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const requestedId = Number(req.params.id);
    const authUser = req.user;
    const authUserId = Number(authUser.id);

    if (authUser.role !== 'ADMIN' && authUserId !== requestedId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const deleted = await userService.deleteUser(requestedId);

    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: `User with ID ${requestedId} deleted successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /users/:id/reset-password  (admin only)
export async function resetUserPasswordByAdmin(req, res, next) {
  try {
    const requestedId = Number(req.params.id);
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        error: 'newPassword is required and must be at least 8 characters long',
      });
    }

    const updated = await userService.resetPasswordAsAdmin(requestedId, newPassword);

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: `Password for user ${requestedId} has been reset by admin.`,
    });
  } catch (err) {
    next(err);
  }
}