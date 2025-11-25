import * as listRepo from '../repositories/listRepo.js';

/*
 *Get lists visible to the current user:
 *ADMIN: all lists
 *USER: only access their own lists
 */
export async function getListsForUser(user) {
  if (user.role === 'ADMIN') {
    return listRepo.findAll();
  }
  return listRepo.findAllByOwner(user.id);
}

/*
 *Get a single list by id with authorization:
 *ADMIN: can view any
 *USER: only access lists they own
 */
export async function getListByIdForUser(id, user) {
  const list = await listRepo.findById(id);
  if (!list) {
    return null;
  }

  if (user.role !== 'ADMIN' && list.ownerId !== user.id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  return list;
}

//Create List
export async function createListForUser(user, data) {
  const { name, description, isActive } = data;
  return listRepo.create({
    ownerId: user.id,
    name,
    description,
    isActive,
  });
}
//Update List
export async function updateListForUser(id, user, data) {
  const list = await listRepo.findById(id);
  if (!list) {
    return null;
  }

  if (user.role !== 'ADMIN' && list.ownerId !== user.id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  //Allows only certain fields to be updated
  const { name, description, isActive } = data;
  return listRepo.update(id, { name, description, isActive });
}

//Delete List
export async function deleteListForUser(id, user) {
  const list = await listRepo.findById(id);
  if (!list) {
    return null;
  }

  if (user.role !== 'ADMIN' && list.ownerId !== user.id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  await listRepo.remove(id);
  return true;
}
