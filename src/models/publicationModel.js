import { Schema, model } from 'mongoose';

const publicationSchema = new Schema({
    titulo: {
        type: String,
        required: true,
    },
    contenido: {
        type: String,
        required: true,
    },
    imagen: {
        type: String,
        default: null,
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now(),
    },
    comentarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
});

const Publication = model('Publication', publicationSchema);

export default Publication;