import * as itemRepo from '../repositories/itemRepo.js';

export async function getAllItems(filters) {
  return itemRepo.findAll(filters);
}

export async function getItemById(id) {
  return itemRepo.findById(id);
}

export async function createItem(data) {
  const { name, defaultUnit, categoryId } = data;
  return itemRepo.create({
    name,
    defaultUnit,
    categoryId,
  });
}

export async function updateItem(id, data) {
  const { name, defaultUnit, categoryId } = data;
  return itemRepo.update(id, { name, defaultUnit, categoryId });
}

export async function deleteItem(id) {
  await itemRepo.remove(id);
  return true;
}
