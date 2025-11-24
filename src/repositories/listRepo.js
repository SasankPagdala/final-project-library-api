import prisma from '../config/db.js';

export async function findAll() {
  return prisma.list.findMany({
    include: {
      owner: { select: { id: true, username: true, email: true, role: true } },
    },
  });
}

export async function findAllByOwner(ownerId) {
  return prisma.list.findMany({
    where: { ownerId },
    include: {
      owner: { select: { id: true, username: true, email: true, role: true } },
    },
  });
}

export async function findById(id) {
  return prisma.list.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, username: true, email: true, role: true } },
    },
  });
}

export async function create({ ownerId, name, description, isActive = true }) {
  return prisma.list.create({
    data: { ownerId, name, description, isActive },
  });
}

export async function update(id, data) {
  return prisma.list.update({
    where: { id },
    data,
  });
}

export async function remove(id) {
  return prisma.list.delete({
    where: { id },
  });
}