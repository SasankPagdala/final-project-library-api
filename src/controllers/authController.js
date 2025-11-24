import * as authService from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    //body validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['username, email, and password are required'],
      });
    }

    const user = await authService.registerUser({ username, email, password });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['email and password are required'],
      });
    }

    const result = await authService.loginUser({ email, password });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await authService.getUserProfile(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

// POST /auth/change-password
export async function changePassword(req, res, next) {
  try {
    const userId = req.user.id; // from authenticate middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }

    await authService.changePassword(userId, currentPassword, newPassword);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}

// POST /auth/reset-password  
export async function resetPassword(req, res, next) {
  try {
    const { username, email, newPassword } = req.body;

    if (!username || !email || !newPassword) {
      return res.status(400).json({
        error: 'username, email, and newPassword are required',
      });
    }

    await authService.resetPasswordByIdentity(username, email, newPassword);

    return res.status(200).json({
      message: 'Password has been reset successfully',
    });
  } catch (err) {
    next(err);
  }
}