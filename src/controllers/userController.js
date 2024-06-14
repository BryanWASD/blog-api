import User from '../models/userModel.js';
import { hashSync } from 'bcrypt';
import { body } from 'express-validator';
import { handleValidationErrors } from "../config/validationsError.js";

const validateUserData = [
    body('email').isEmail().normalizeEmail().withMessage('Por favor, ingresa un correo electrónico válido.'),
    body('password').isLength({ min: 4 }).trim().withMessage('La contraseña debe tener al menos 4 caracteres.'),
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio.'),
    body('role').optional().isIn(['user', 'admin']).withMessage('El rol debe ser "user" o "admin".'),
];

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const createUser = [
    validateUserData,
    handleValidationErrors,
    async (req, res) => {
        try {
            req.body.password = hashSync(req.body.password, 10);
            const newUser = new User(req.body);
            await newUser.save();
            res.status(201).json(newUser);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },
]; 

export const deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        const requestingUser = await User.findById(req.user.userId);
        if (requestingUser.role !== 'admin') {
            return res.status(403).json({ message: 'Not authoried only admins can delete users' });
        }
        const deletedUser = await User.findByIdAndDelete(id);
        if(!deletedUser) {
            return res.status(404).json({message:'user not found'});
        }
        res.json({message: 'user deleted'});
    }catch(e){
        res.status(500).json({message: e.message});
    }
};

export const editUser = [
    validateUserData,
    handleValidationErrors,
    async (req, res) => {
        const { id } = req.params;
        try {
            const updates = req.body;
            if (updates.password) {
                updates.password = hashSync(updates.password, 10);
            }
            const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'user not found' });
            }
            res.status(200).json(updatedUser);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },
];
