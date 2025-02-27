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

export const productValidator = [
    body('name', 'Product name cannot be empty')
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage("Can't exceed 50 characters"),
    body('description', 'Description cannot be empty')
        .notEmpty()
        .isLength({ max: 250 })
        .withMessage("Can't exceed 250 characters"),
    body('price', 'Price must be a positive number')
        .notEmpty()
        .isFloat({ min: 0 }),
    body('stock', 'Stock must be a positive integer')
        .notEmpty()
        .isInt({ min: 0 }),
    body('category', 'Category must be a valid ObjectId')
        .notEmpty()
        .custom(objectIdValid),
    validateErrorWithoutImg
];

export const invoiceValidator = [
    body('user', 'User ID is required and must be valid')
        .notEmpty()
        .custom(objectIdValid),
    body('products', 'Products array cannot be empty')
        .isArray({ min: 1 })
        .withMessage('At least one product is required'),
    body('products.*.product', 'Each product must have a valid ID')
        .notEmpty()
        .custom(objectIdValid),
    body('products.*.quantity', 'Quantity must be a positive integer')
        .notEmpty()
        .isInt({ min: 1 }),
    body('products.*.price', 'Price must be a positive number')
        .notEmpty()
        .isFloat({ min: 0 }),
    body('total', 'Total must be a positive number')
        .notEmpty()
        .isFloat({ min: 0 }),
    body('status', 'Status must be either Pending, Paid, or Cancelled')
        .optional()
        .isIn(['Pending', 'Paid', 'Cancelled']),
    validateErrors
];

export const cartValidator = [
    body('productId', 'Product ID is required and must be valid')
        .notEmpty()
        .custom(objectIdValid),
    body('quantity', 'Quantity must be a positive integer')
        .notEmpty()
        .isInt({ min: 1 }),
    validateErrors
];