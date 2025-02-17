//Validar campos en las rutas
import { body } from "express-validator" //Capturar todo el body de la solicitud
import { validateErrors, validateErrorWithoutImg } from "./validate.error.js"
import { existUsername, existEmail, objectIdValid } from "./db.validators.js"

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

export const loginValidator = [
    body('userLoggin', 'Username or email cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
        validateErrorWithoutImg
]

//Validaciones para realizar update
export const updateUserValidator = [
    body('name', 'Name is required').optional().notEmpty(),
    body('surname', 'Surname is required').optional().notEmpty(),
    body('email', 'Email is not valid').optional().isEmail(),
    body('phone', 'Phone is not valid').optional().isMobilePhone(),
    validateErrors
]

export const updatePasswordValidator = [
    body('currentPassword', 'Current password is required').notEmpty(),
    body('newPassword', 'New password is required')
        .notEmpty()
        .isStrongPassword()
        .withMessage('Please write a stronger password')
        .isLength({min: 8}),
    validateErrors
]

//validator para categoria
export const categoryValidator = [ 
    body('name', 'Name is required').notEmpty().isLength({max: 50}),
    body('description','Description is requiered').notEmpty(),
    validateErrorWithoutImg
]