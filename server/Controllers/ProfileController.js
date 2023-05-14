import { User } from '../Models/UserModel.js';
import jwt from 'jsonwebtoken';
import '../config.js';

export const profile = async (req, res) => {
    const { token } = req.cookies;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
            if(err) throw err;
            const userLogged = await User.findById(data.id);
            const { firstName, lastName, role, email, _id, password, userImage } = userLogged;
            res.json({ firstName, lastName, role, email, _id, password, userImage })
        })
    }else{
        res.json(null);
    }
}