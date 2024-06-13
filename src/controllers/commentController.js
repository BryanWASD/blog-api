import Comment from "../models/commentModel.js";
import Publication from "../models/publicationModel.js";
import { body } from 'express-validator';
import { handleValidationErrors } from "../config/validationsError.js";

const validateCommentData = [
    body('contenido').trim().notEmpty().withMessage('El contenido es obligatorio').escape(),
    body('publicacionId').trim().notEmpty().withMessage('El ID de la publicación es obligatorio').isMongoId().withMessage('El ID de la publicación debe ser un ID válido'),
];


export const createComment = [
    validateCommentData,
    handleValidationErrors,
    async (req, res) => {
        try {
            const {contenido, publicacionId} = req.body;
            const autor = req.user.userId
            const newComment = new Comment({
                contenido,
                autor,
                publicacion: publicacionId,
            });
            await newComment.save();
    
            const publication = await Publication.findById(publicacionId);
            if (!publication) {
                return res.status(404).json({ error: 'Publicación no encontrada' });
            }
            publication.comentarios.push(newComment._id);
            await publication.save();
    
            res.status(201).json(newComment);
        } catch (e) {
            res.status(400).json({error: e.message});
        }
    },
];

export const editComment = [
    validateCommentData,
    handleValidationErrors,
    async (req, res) => {
        const {id} = req.params;
        try{
            const comment = await Comment.findById(id);
            if(!comment){
                return res.status(404).json({message: 'Comment not found'});
            }
            if (comment.autor.toString() !== req.user.userId){
                return res.status(403).json({ message: 'Unauthorized: You are not the author of the comment' });
            }
            const updates = req.body;
            const updateComment = await Comment.findByIdAndUpdate(id, updates, {new: true});
            res.status(200).json(updateComment);

        }catch(e){
            res.status(400).json({ error: e.message });
        }
    }
];

export const deleteComment = async (req, res) => {
    const {id} = req.params;
    try {
        const comment = await Comment.findById(id);
        if (comment.autor.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized: You are not the author of this comment' });
        }
            if(!comment) {
            return res.status(404).json({message:'comment not found'});
        }
        await Comment.findByIdAndDelete(id);
        res.json({message: 'comment deleted'});
    }catch(e){
        res.status(500).json({message: e.message});
    }
};