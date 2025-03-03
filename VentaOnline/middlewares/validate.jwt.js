//Middleware de validación de tokens
'use strict'

import jwt from 'jsonwebtoken'
import { findUser } from '../helpers/db.validators.js'

//Validar que venga un token válido y no haya expirado
export const validateJwt = async (req, res, next) => {
    try {
        let secretKey = process.env.SECRET_KEY;
        let { authorization } = req.headers;

        if (!authorization) 
            return res.status(401).send({ message: 'Unauthorized' });

        let decodedToken = jwt.verify(authorization, secretKey);

        // Buscar el usuario en la BD
        const validateUser = await findUser(decodedToken.uid); // El token guarda `uid`

        if (!validateUser) 
            return res.status(404).send({ success: false, message: 'User not found - Unauthorized' });

        // Asegurar que req.user.uid siempre existe
        req.user = {
            uid: validateUser._id.toString(),  // Convertir a String para evitar problemas con ObjectId
            name: validateUser.name,
            username: validateUser.username,
            role: validateUser.role
        };

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

export const validateInvoiceAccess = async (req, res, next) => {
    try {
        const { user } = req;

        if (!user || !user.uid) {
            return res.status(403).send({ success: false, message: 'Unauthorized: No user data found 👻' });
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send({ success: false, message: 'Unauthorized access' });
    }
};

