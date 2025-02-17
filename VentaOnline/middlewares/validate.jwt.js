//Middleware de validación de tokens
'use strict'

import jwt from 'jsonwebtoken'
import { findUser } from '../helpers/db.validators.js'

//Validar que venga un token válido y no haya expirado
export const validateJwt = async(req, res, next)=>{
    try{
        //Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //Obtener el token de los headers
        let { authorization } = req.headers
        //verificar si viene el token
        if(!authorization) return res.status(401).send({message: 'Unauthorized'})
        //Desencriptar el token
        let user = jwt.verify(authorization, secretKey)
        //Verificar que aún exista el usuario en la BD
        const validateUser = await findUser(user.uid)
        if(!validateUser) return res.status(404).send(
            {
                success: false,
                message: 'User not found - Unauthorized'
            }
        )
        //Inyectar la información del usuario a la solicitud
        req.user = user
        //Todo salió bien, pase a la siguiente función
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token or expired'})
    }
}

//Validación por roles (Después de la validación del token)
export const isAdmin = async(req, res, next)=>{
    try{
        const { user } = req
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).send({
                success: false,
                message: `You don't have access 👻 | username ${user ? user.username : 'Unknown'}`
            });
        } else if (user.status === false) {
            return res.status(403).send({
                success: false,
                message: `Your account is deleted, you cannot do any changes 👻 | username ${user.username}`
            });
        }        
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send(
            {
                success: false,
                message: 'Unauthorized role'
            }
        )
    }
}

export const isUser = async(req, res, next)=>{
    try{
        const { user } = req
        const { id } = req.params
        
        if(user.uid !== id) {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized: You can only edit your own account 👻'
            })
        } else if (user.status === false){
            return res.status(403).send({
                success: false,
                message: `Your account is deleted, you cannot do any changes 👻 | username ${user.username}`
            })
        }
        
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send(
            {
                success: false,
                message: 'Unauthorized role'
            }
        )
    }
}