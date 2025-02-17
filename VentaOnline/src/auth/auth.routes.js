//Rutas de autenticación
import { Router } from 'express'
import { 
    login,
    register,
    test
 } from './auth.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { loginValidator, registerValidator } from '../../helpers/validators.js'
import { uploadProfilePicture } from '../../middlewares/multer.uploads.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.error.js'

const api = Router()

//Rutas públicas
api.post(
    '/register', 
    [
        uploadProfilePicture.single('profilePicture'),
        registerValidator,
        deleteFileOnError
    ], 
    register
)
api.post(
    '/login', 
    [
        loginValidator
    ], 
    login
)

//Rutas privadas
//middleware
api.get('/test', validateJwt, test)

//Exportar
export default api