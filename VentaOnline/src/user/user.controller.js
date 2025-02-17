//Logica de negocio

import { encrypt, checkPassword } from "../../utils/encrypt.js"
import User from "./user.model.js"
 
//Obtener todo
export const getAll = async(req, res)=>{
    try{
        const {limit = 20, skip = 0} = req.query
        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if(users.length === 0 )return res.status(404).send({message: 'Users not found', success:false})
        return res.send(
            {
            success:true,
            message: 'Users found: ', 
            users,
            total:users.length
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send({success:false, message: 'General error', err})
    }
}

//Obtener usuario por ID
export const get = async(req, res)=>{
    try{
        const {id} = req.params
        const user = await User.findById(id)

        if(!user) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User found',
                user
            }
        )

    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error',
                err
            }
        )
        
    }
}


// Update de usuario a si mismo (CLIENT)
export const update = async(req, res) => {
    try {
        const { id } = req.params
        const { name, surname, email, phone } = req.body

        // Verificar si el usuario existe
        const user = await User.findById(id)
        if(!user) return res.status(404).send({
            success: false,
            message: 'User not found'
        })

        // Crear objeto con los campos a actualizar
        const updateData = {}
        if(name) updateData.name = name
        if(surname) updateData.surname = surname
        if(email) updateData.email = email
        if(phone) updateData.phone = phone

        // Actualizar usuario
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Retorna el documento actualizado
        )

        return res.send({
            success: true,
            message: 'User updated successfully 👻',
            user: updatedUser
        })

    } catch(err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General Error',
            err
        })
    }
}

// Update de usuario (DESDE ADMIN)
export const updateAdmin = async(req, res) => {
    try {
        const { id } = req.params
        const { name, surname, email, phone, role} = req.body

        // Verificar si el usuario existe
        const user = await User.findById(id)
        if(!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }else if(user.role === 'ADMIN'){
            return res.status(403).send({
                success: false,
                message: 'You cannot update an admin user 👻'
            })
        }

        // Crear objeto con los campos a actualizar
        const updateData = {}
        if(name) updateData.name = name
        if(surname) updateData.surname = surname
        if(email) updateData.email = email
        if(phone) updateData.phone = phone
        if(role) updateData.role = role

        // Actualizar usuario
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Retorna el documento actualizado
        )

        return res.send({
            success: true,
            message: 'User updated successfully 👻',
            user: updatedUser
        })

    } catch(err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General Error',
            err
        })
    }
}

//Update de password
export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Verificar si el usuario existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // Verificar si la contraseña actual coincide
        const isMatch = await checkPassword(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await encrypt(newPassword);

        // Actualizar la contraseña en la base de datos
        user.password = hashedPassword;
        await user.save();

        return res.send({
            success: true,
            message: "Password updated successfully 👻",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "General Error",
            err,
        });
    }
};

//Eliminar user a si mismo (cambio de status)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, currentPassword } = req.body;

        // Verificar si el usuario existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send(
                { 
                    success: false, message: "User not found 👻" 
                }
            );
        }

        //Verificar si el email coincide
        if (user.email !== email) {
            return res.status(400).send({
                success: false,
                message: "Email does not match 👻",
            })
        };

        //Verificar si la contraseña coincide
        const isMatch = await checkPassword(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Current password is incorrect",
            });
        }
        
        user.status = false; // Cambia el estado del usuario en lugar de eliminarlo
        await user.save();
        
        return res.send({ success: true, message: "User deleted successfully 👻" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General Error", err });
    }
};

//Eliminar user como ADMIN (cambio de status)
export const deleteUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si el usuario existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send(
                { 
                    success: false, message: "User not found 👻" 
                }
            );
        }else if(user.role === 'ADMIN'){
            return res.status(403).send({ 
                success: false, 
                message: "You can't delete an admin user 👻"
            })
        }
        
        user.status = false; // Cambia el estado del usuario en lugar de eliminarlo
        await user.save();
        
        return res.send({ success: true, message: "User deleted successfully 👻" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General Error", err });
    }
};
