import prisma from '../config/db.js';

export async function createUser({ username, email, passwordHash, role = 'USER' }) {
  return prisma.user.create({
    data: { username, email, passwordHash, role },
  });
}

export async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) }, // check if id is int 
    select: { id: true, username: true, email: true, role: true, createdAt: true },
  });
}

// UPDATE USER (used by PUT /users/:id) 
export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

//  DELETE USER (used by DELETE /users/:id) 
// Cascade deletion of lists/shares/items is handled in schema.prisma (onDelete: Cascade)
export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id: Number(id) },
  });
}

export async function updateUserPassword(id, passwordHash) {
  return prisma.user.update({
    where: { id: Number(id) },
    data: { passwordHash },
  });
}