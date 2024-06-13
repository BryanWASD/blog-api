import mongoose from 'mongoose';
import { MONGO_URL } from './config.js';

export const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to database');
    } catch(e){
        console.log('Error connecting to database: ' + e.message);
        process.exit(1);
    }
};