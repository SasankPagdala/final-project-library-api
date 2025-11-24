import {
  findById as repoFindById,
  findByEmail as repoFindByEmail,
  updateUser as repoUpdateUser,
  deleteUser as repoDeleteUser,
  updateUserPassword as repoUpdateUserPassword,
} from '../repositories/userRepo.js';
import bcrypt from 'bcrypt';

export async function getUserById(id) {
  const user = await repoFindById(Number(id));
  return user || null; 
}

export async function updateUser(id, updates) {
  const numericId = Number(id);

  // Do not allow updating password through this route
  if ('password' in updates || 'passwordHash' in updates) {
    const err = new Error('Password cannot be updated via this endpoint');
    err.status = 400;
    throw err;
  }

  // Duplicate email check
  if (updates.email) {
    const existing = await repoFindByEmail(updates.email);

    // existing.id !== id means the email is used by another user
    if (existing && existing.id !== numericId) {
      const err = new Error('Email already in use');
      err.status = 400;
      throw err;
    }
  }

  // Perform update
  const updated = await repoUpdateUser(numericId, updates);
  return updated; // repo returns safe fields only
}

export async function deleteUser(id) {
  const numericId = Number(id);

  // Check if user exists first
  const user = await repoFindById(numericId);
  if (!user) return false;

  // Cascading delete handled in schema.prisma (onDelete: Cascade)
  await repoDeleteUser(numericId);

  return true;
}

export async function resetPasswordAsAdmin(id, newPassword) {
  const numericId = Number(id);

  const user = await repoFindById(numericId);
  if (!user) return false;

  const hash = await bcrypt.hash(newPassword, 10);

  await repoUpdateUserPassword(numericId, hash);

  return true;
}