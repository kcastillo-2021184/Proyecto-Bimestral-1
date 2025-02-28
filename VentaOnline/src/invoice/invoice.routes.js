import { Router } from 'express';
import { get, getAll, createInvoice, removeInvoice, updateInvoice, getByUser } from './invoice.controller.js';
import { validateJwt, isAdmin, isUser } from '../../middlewares/validate.jwt.js';
import { invoiceValidator } from '../../helpers/validators.js';

const api = Router();

// Rutas privadas para administración
api.get('/', [validateJwt, isAdmin], getAll);
api.get('/:id', [validateJwt, isAdmin], get);
api.get('/user/:userId', [validateJwt, isUser], getByUser);

// Crear una factura a partir del carrito
api.post('/', [validateJwt, isUser, invoiceValidator], createInvoice);

// Actualizar una factura 
api.put('/update/:id', [validateJwt, isAdmin], updateInvoice);

// Eliminar una factura
api.delete('/delete/:id', [validateJwt, isAdmin], removeInvoice);

export default api;
