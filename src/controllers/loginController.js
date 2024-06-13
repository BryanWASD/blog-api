import  User  from '../models/userModel.js'
import  { compareSync }  from 'bcrypt';
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from '../config/config.js';

const createToken = (user) => {
    let payload = {
        userId: user._id,
    };
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "1d"} )
}

const getByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (e) {
        return undefined;
    }
};

export const loginUser = async (req, res) => {
    try{    
        const user = await getByEmail(req.body.email)
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const equals = compareSync(req.body.password, user.password);
            if (!equals){
                return res.status(401).json({ error: "Email o contraseña incorrectos" });
            } 
            const token = createToken(user);
            return res.status(200).json({
                success: true,
                token,
                message: "Inicio de sesion exitoso"
            });
        
    }catch(e){
        return res.status(500).json({ error: e.message });
    }

}