import * as listShareRepo from '../repositories/listShareRepo.js';
import prisma from '../config/db.js';

export async function getListShares(listId) {
  return listShareRepo.findAll(listId);
}

export async function getListShareById(id) {
  return listShareRepo.findById(id);
}

export async function getSharedWithMe(userId) {
  return listShareRepo.findSharedWithUser(userId);
}

export async function createListShare(data) {
  const { listId, sharedWithUserId, permissionLevel } = data;

  // Check if list exists
  const list = await prisma.list.findUnique({
    where: { id: listId },
  });

  if (!list) {
    const error = new Error('List not found');
    error.status = 404;
    throw error;
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: sharedWithUserId },
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  // Check if share already exists
  const existingShare = await listShareRepo.findByListAndUser(
    listId,
    sharedWithUserId
  );

  if (existingShare) {
    const error = new Error('List is already shared with this user');
    error.status = 409;
    throw error;
  }

  return listShareRepo.create({
    listId,
    sharedWithUserId,
    permissionLevel,
  });
}

export async function updateListShare(id, data) {
  const { permissionLevel } = data;
  return listShareRepo.update(id, { permissionLevel });
}

export async function deleteListShare(id) {
  await listShareRepo.remove(id);
  return true;
}
