import { Router } from 'express';
import { get, getAll, createInvoice, updateInvoice, removeInvoice } from './invoice.controller.js';
import { validateJwt, isAdmin, isUser } from '../../middlewares/validate.jwt.js';
import { invoiceValidator } from '../../helpers/validators.js';

const api = Router();

// Rutas privadas
api.get('/', [validateJwt, isAdmin], getAll);
api.get('/:id', [validateJwt, isAdmin], get);
api.post('/', [validateJwt, isUser, invoiceValidator], createInvoice);
api.put('/update/:id', [validateJwt, isAdmin, invoiceValidator], updateInvoice);
api.delete('/delete/:id', [validateJwt, isAdmin], removeInvoice);

export default api;
