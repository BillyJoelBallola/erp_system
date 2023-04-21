import { User } from '../Models/UserModel.js';
import jwt from 'jsonwebtoken';
import '../config.js';

export const profile = async (req, res) => {
    const { token } = req.cookies;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
            if(err) throw err;
            const { firstName, role, email, _id } = await User.findById(data.id);
            res.json({ firstName, role, email, _id })
        })
    }else{
        res.json(null);
    }
}