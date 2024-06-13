import { v2 as cloudinary } from 'cloudinary';
import { CLD_API_KEY, CLD_NAME, CLD_SECRET } from './config.js';
    cloudinary.config({
        cloud_name: CLD_NAME,
        api_key: CLD_API_KEY,
        api_secret: CLD_SECRET,
    });
export default cloudinary;
