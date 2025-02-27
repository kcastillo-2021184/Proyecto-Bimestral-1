import { Router } from 'express';
import { get, getAll, createProduct, updatedProduct, removeProduct } from './product.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';
import { productValidator } from '../../helpers/validators.js';

const api = Router();

// Rutas privadas
api.get('/', validateJwt, getAll);
api.get('/:id', validateJwt, get);
api.post('/', [validateJwt, isAdmin, productValidator], createProduct);
api.put('/update/:id', [validateJwt, isAdmin, productValidator], updatedProduct);
api.delete('/delete/:id', [validateJwt, isAdmin], removeProduct);

export default api;
