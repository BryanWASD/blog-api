import {config} from 'dotenv';
config();

export const MONGO_URL = process.env.MONGO_URL
export const PORT = process.env.PORT
export const JWT_SECRET = process.env.JWT_SECRET
export const CLD_NAME = process.env.CLD_NAME
export const CLD_API_KEY = process.env.CLD_API_KEY
export const CLD_SECRET = process.env.CLD_SECRET