import { User } from '../Models/UserModel.js';
import jwt from 'jsonwebtoken';
import fs from "fs";
import bcrypt from "bcrypt";
import '../config.js';

const brcyptSalt = bcrypt.genSaltSync(10);

export const profile = async (req, res) => {
    const { token } = await req.cookies;
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

export const updateProfileImage = async (req, res) => {
    const { token } = await req.cookies;
    const { uploadedImage } = await req.body;
    try {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
            if(err) throw err;
            const userLogged = await User.findById(data.id);
            if(userLogged.userImage !== ""){
                fs.unlink(`./uploads${userLogged.userImage}`, (err) => {
                    if(err) throw err;
                });
            }
            userLogged.set({
                userImage: uploadedImage,
            });
            userLogged.save();
            res.json(userLogged);
        })
    } catch (error) {   
        res.json(error.message);
    }
}

export const updateInfo = async (req, res) => {
    const { token } = await req.cookies;
    const { firstName, lastName, email } = await req.body;
    try {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
            if(err) throw err;
            const userLogged = await User.findById(data.id);
            userLogged.set({
                firstName,
                lastName,
                email
            });
            userLogged.save();
            res.json(userLogged);
        })
    } catch (error) {   
        res.json(error.message);
    }
}

export const updatePassword = async (req, res) => {
    const { token } = await req.cookies;
    const { newPassword } = await req.body;
    try {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
            if(err) throw err;
            const userLogged = await User.findById(data.id);
            userLogged.set({
                password: bcrypt.hashSync(newPassword, brcyptSalt)
            });
            userLogged.save();
            res.json(userLogged);
        })
    } catch (error) {   
        res.json(error.message);
    }
}