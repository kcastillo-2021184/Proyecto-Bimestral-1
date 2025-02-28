//Modelo de usuario

import { Schema, model } from "mongoose";

const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`]            
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `Can't be overcome 25 characters`]            
        },
        username: {
            type: String,
            unique: true, //No se puede repetir el valor
            //lowercase: true, //Lo vuelve minuscula
            required: [true, 'Username is required'],
            maxLength: [15, `Can't be overcome 15 characters`]            
        },
        email: {
            type: String,
            //Vamos a ver que pasa si no es unico
            //isEmail: true,
            required: [true, 'Email is required'],
            //match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],

        },
        password: {
            type: String,
            required:[true, 'Password is required'],
            minLength: [8, 'Password must be 8 characters'],
            maxLength: [100, `Can't be overcome 16 characters`],
            //match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm]
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            maxLength: [13, `Can't be overcome 8 numbers`],
            minLength: [8, 'Number must be 8 numbers']
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            uppercase: true,
            enum: ['ADMIN', 'CLIENT'],
            default: 'CLIENT'
        },
        status: {
            type: Boolean,
            default: true // Los usuarios estarán activos por defecto
        }
    }
)

//Modificar El toJSON para excluir datos en la respuesta
userSchema.methods.toJSON = function(){
    const {__v, password, ...user} = this.toObject()
    return user
}

//Crear y exportar el modelo
export default model('User', userSchema)