import prisma from '../config/db.js';

export async function findAll(listId) {
  return prisma.listShare.findMany({
    where: { listId },
    include: {
      sharedWithUser: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
}

export async function findById(id) {
  return prisma.listShare.findUnique({
    where: { id },
    include: {
      sharedWithUser: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
}

export async function findByListAndUser(listId, userId) {
  return prisma.listShare.findUnique({
    where: {
      listId_sharedWithUserId: {
        listId,
        sharedWithUserId: userId,
      },
    },
  });
}

export async function findSharedWithUser(userId) {
  return prisma.listShare.findMany({
    where: { sharedWithUserId: userId },
    include: {
      list: {
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function create(data) {
  return prisma.listShare.create({
    data,
    include: {
      sharedWithUser: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
}

export async function update(id, data) {
  return prisma.listShare.update({
    where: { id },
    data,
    include: {
      sharedWithUser: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
}

export async function remove(id) {
  return prisma.listShare.delete({
    where: { id },
  });
}
