import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepo.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';//may want to change later
const JWT_EXPIRES_IN = '1h';

function toPublicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function registerUser({ username, email, password }) {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    const err = new Error('Email is already registered');
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await userRepo.createUser({
    username,
    email,
    passwordHash,
    role: 'USER',
  });

  return toPublicUser(user);
}

export async function loginUser({ email, password }) {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    user: toPublicUser(user),
  };
}

export async function getUserProfile(userId) {
  const user = await userRepo.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return user;
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    const err = new Error('Current password is incorrect');
    err.status = 400;
    throw err;
  }

  if (!newPassword || newPassword.length < 8) {
    const err = new Error('New password must be at least 8 characters long');
    err.status = 400;
    throw err;
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newHash,  
    },
  });
}

export async function resetPasswordByIdentity(username, email, newPassword) {
  const user = await prisma.user.findFirst({
    where: { username, email },
  });

  if (!user) {
    const err = new Error('Invalid username or email');
    err.status = 400;
    throw err;
  }

  if (!newPassword || newPassword.length < 8) {
    const err = new Error('New password must be at least 8 characters long');
    err.status = 400;
    throw err;
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newHash,
    },
  });
}
