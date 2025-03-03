import { Router } from 'express';
import { get, getAll, createProduct, updatedProduct, removeProduct, getOutOfStock, getTopSellers, searchByName, getByCategory  } from './product.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';
import { productValidator } from '../../helpers/validators.js';

const api = Router();

// Rutas privadas
api.get('/', validateJwt, getAll);
api.post('/', [validateJwt, isAdmin, productValidator], createProduct);
api.put('/update/:id', [validateJwt, isAdmin, productValidator], updatedProduct);
api.delete('/delete/:id', [validateJwt, isAdmin], removeProduct);

// Rutas adicionales
api.get('/out-of-stock', [validateJwt], getOutOfStock);
api.get('/top-sellers', [validateJwt], getTopSellers);
api.post('/search', searchByName);
api.get('/category/:categoryId', getByCategory);

 
api.get('/:id', validateJwt, get);

export default api;
