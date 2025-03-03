import { Router } from 'express';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './category.controller.js';
import {categoryValidator} from '../../helpers/validators.js'

const router = Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById, isAdmin);

router.post('/', [validateJwt, isAdmin, categoryValidator], createCategory);
router.put('/:id', [validateJwt, isAdmin], updateCategory);
router.delete('/:id', [validateJwt, isAdmin], deleteCategory);

export default router;