import { User } from "../models/users.js";
import logger from "../logs/logger.js";
import { comparar } from "../common/bcrypt.js";
import  jwt  from 'jsonwebtoken';
import 'dotenv/config'

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404), json({ message: 'no encontrado' });
        }
        if (!await comparar(password, user.password)) {
            return res.status(403).json({ message: 'no autorizado' })
        }
        const secret = process.env.JWT_SECRET
        const seg = process.env.JWT_EXPIRES_SECONDS
        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: eval(seg),
        });
        res.json(token);
    } catch (error) {

        logger.error('error al login ' + error);
        res.status(500).json({ message: 'server error' });
    }
}

export default {
    login,
};