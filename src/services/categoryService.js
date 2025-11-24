import * as categoryRepo from '../repositories/categoryRepo.js';

export async function getAllCategories() {
  return categoryRepo.findAll();
}

export async function getCategoryById(id) {
  return categoryRepo.findById(id);
}

export async function createCategory(data) {
  const { name, description, displayOrder } = data;
  return categoryRepo.create({ name, description, displayOrder });
}

export async function updateCategory(id, data) {
  const { name, description, displayOrder } = data;
  return categoryRepo.update(id, { name, description, displayOrder });
}

export async function deleteCategory(id) {
  await categoryRepo.remove(id);
  return true;
}
