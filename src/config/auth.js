import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const authentication = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (e, user) => {
        if(e){
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}