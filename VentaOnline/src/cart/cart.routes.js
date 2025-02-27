import { Router } from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from './cart.controller.js';
import { validateJwt, isUser } from '../../middlewares/validate.jwt.js';
import { cartValidator } from '../../helpers/validators.js';

const api = Router();

// Rutas privadas para manejar el carrito
api.get('/', [validateJwt, isUser], getCart);
api.post('/', [validateJwt, isUser, cartValidator], addToCart);
api.delete('/remove/:productId', [validateJwt, isUser], removeFromCart);
api.delete('/clear', [validateJwt, isUser], clearCart);

export default api;