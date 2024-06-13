import Publication from "../models/publicationModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary_config.js";
import fs from 'fs';
import { body } from 'express-validator';
import { handleValidationErrors } from "../config/validationsError.js";


const validatePublicationData = [
    body('titulo').trim().notEmpty().withMessage('El título es obligatorio').escape(),
    body('contenido').trim().notEmpty().withMessage('El contenido es obligatorio').escape(),
];

export const createPublication = [
    validatePublicationData,
    handleValidationErrors,
    async (req, res) => {
        try {
            const { titulo, contenido } = req.body;
            const autor = req.user.userId;
    
            let imagenUrl = null;
    
            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path);
                imagenUrl = result.secure_url;
                fs.unlinkSync(req.file.path);
            }
    
            const newPublication = new Publication({
                titulo,
                contenido,
                imagen: imagenUrl,
                autor
            });
            await newPublication.save();
    
            const autorDetails = await User.findById(newPublication.autor);
    
            res.status(201).json({
                _id: newPublication._id,
                titulo: newPublication.titulo,
                contenido: newPublication.contenido,
                imagen: newPublication.imagen,
                autor: {
                    id: autorDetails._id,
                    nombre: autorDetails.nombre
                },
                fechaCreacion: newPublication.fechaCreacion,
                comentarios: newPublication.comentarios
            });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },
];

export const getPublications = async (req, res) => {
    try{
        const publications = await Publication.find()
        .populate('autor', 'nombre apellido')
        .populate({
            path: 'comentarios', 
            populate: {
                path: 'autor', 
                select: 'nombre apellido',
        }
    });
        res.json(publications);
    }catch(e){
        res.status(500).json({ error: e.message });
    }
}

export const editPublication = [
    validatePublicationData,
    handleValidationErrors,
    async (req, res) => {
        const { id } = req.params;
        try {
            const publication = await Publication.findById(id);
            if(!publication) {
                return res.status(404).json({message:'Post not found'});
            }
            if (publication.autor.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'Unauthorized: You are not the author of this post' });
            }

            const updates = req.body;
            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path);
                updates.imagen = result.secure_url;
                fs.unlinkSync(req.file.path);
            }

            const updatedPublication = await Publication.findByIdAndUpdate(id, updates, { new: true });
            res.status(200).json(updatedPublication);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
];

export const deletePublication = async (req, res) => {
    const {id} = req.params;
    try {
        const publication = await Publication.findById(id);
        if (publication.autor.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized: You are not the author of this post' });
        }
        if(!publication) {
            return res.status(404).json({message:'post not found'});
        }
        await Publication.findByIdAndDelete(id);
        res.json({message: 'post deleted'});
    }catch(e){
        res.status(500).json({message: e.message});
    }
};