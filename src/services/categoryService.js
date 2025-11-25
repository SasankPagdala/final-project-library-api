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

// FIXED: handle P2003 from Prisma
export async function deleteCategory(id) {
  try {
    await categoryRepo.remove(id);
    return true;
  } catch (err) {
    // Foreign key violation: items still reference this category
    if (err.code === 'P2003' && err.meta?.constraint?.includes('Item_categoryId_fkey')) {
      const e = new Error(
        'Cannot delete category because there are items assigned to it. Delete or reassign those items first.'
      );
      e.status = 409; // HTTP 409 Conflict
      throw e;
    }
    throw err; // let other errors bubble
  }
}
