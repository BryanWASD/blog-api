import { Schema, model } from 'mongoose';

const emailRegex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: [emailRegex, 'Ingrese un correo valido']

    },
    password: {
        type: String,
        required: true,
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },

});

const User = model('User', userSchema);

export default User;