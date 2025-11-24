import * as categoryService from '../services/categoryService.js';

export async function getCategories(req, res, next) {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
}

export async function getCategoryById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['ID must be a number'],
      });
    }

    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, description, displayOrder } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['name is required and must be a string'],
      });
    }

    const category = await categoryService.createCategory({
      name,
      description,
      displayOrder,
    });

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['ID must be a number'],
      });
    }

    const { name, description, displayOrder } = req.body;

    const category = await categoryService.updateCategory(id, {
      name,
      description,
      displayOrder,
    });

    res.status(200).json(category);
  } catch (err) {
    if (err.code === 'P2025') {
      //if Prisma "record not found"
      return res.status(404).json({ error: 'Category not found' });
    }
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['ID must be a number'],
      });
    }

    await categoryService.deleteCategory(id);
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    next(err);
  }
}
