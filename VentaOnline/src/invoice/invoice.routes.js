import { Router } from 'express';
import { get, getAll, createInvoice, removeInvoice, updateInvoice, getByUser } from './invoice.controller.js';
import { validateJwt, isAdmin, isUser } from '../../middlewares/validate.jwt.js';
import { invoiceValidator } from '../../helpers/validators.js';

const api = Router();

// Rutas privadas para administración
api.get('/user', [validateJwt, isUser], getByUser);
api.get('/', [validateJwt, isAdmin], getAll);
api.get('/:id', [validateJwt, isAdmin], get);

// Crear una factura a partir del carrito
api.post('/', [validateJwt, isUser], createInvoice);

// Actualizar una factura 
api.put('/update/:id', [validateJwt, isAdmin], updateInvoice);

// Eliminar una factura
api.delete('/delete/:id', [validateJwt, isAdmin], removeInvoice);

export default api;
