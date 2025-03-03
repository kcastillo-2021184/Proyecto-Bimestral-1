//Middleware de validación de tokens
'use strict'

import jwt from 'jsonwebtoken'
import { findUser } from '../helpers/db.validators.js'

//Validar que venga un token válido y no haya expirado
export const validateJwt = async(req, res, next) => {
    try {
        let secretKey = process.env.SECRET_KEY;
        let { authorization } = req.headers;

        if (!authorization) 
            return res.status(401).send({ message: 'Unauthorized' });

        let user = jwt.verify(authorization, secretKey);
        
        const validateUser = await findUser(user.id || user.uid); // Asegurar compatibilidad con la BD
        if (!validateUser) 
            return res.status(404).send({ success: false, message: 'User not found - Unauthorized' });

        req.user = validateUser; // Aquí aseguramos que es el usuario correcto
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send({ message: 'Invalid token or expired' });
    }
};


//Validación por roles (Después de la validación del token)
export const isAdmin = async(req, res, next) => {
    try {

        if (!req.user || req.user.role !== 'ADMIN') {
            return res.status(403).send({
                success: false,
                message: `You don't have access 👻 | username ${req.user ? req.user.username : 'Unknown'}`
            });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send({
            success: false,
            message: 'Unauthorized role'
        });
    }
};

export const isUser = async (req, res, next) => {
    try {
        const { user } = req;
        const { id } = req.params;
        
        if (id && user.uid !== id) {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized: You can only edit your own account 👻'
            });
        }

        if (user.status === false) {
            return res.status(403).send({
                success: false,
                message: `Your account is deleted, you cannot do any changes 👻 | username ${user.username}`
            });
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send({
            success: false,
            message: 'Unauthorized role'
        });
    }
};
