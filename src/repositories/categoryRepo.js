import prisma from '../config/db.js';

export async function findAll() {
  return prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}

export async function findById(id) {
  return prisma.category.findUnique({
    where: { id: Number(id) },
  });
}

export async function create(data) {
  return prisma.category.create({
    data,
  });
}

export async function update(id, data) {
  return prisma.category.update({
    where: { id: Number(id) },
    data,
  });
}

export async function remove(id) {
  return prisma.category.delete({
    where: { id: Number(id) },
  });
}
