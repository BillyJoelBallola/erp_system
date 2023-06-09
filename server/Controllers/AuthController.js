import { User } from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import '../config.js';

const brcyptSalt = bcrypt.genSaltSync(10);
export const addUser = async (req, res) => {
    const userData = req.body;
    const { firstName, lastName, role, email, password, userImage} = await userData;

    try {
        const newUserData = await User.create({
            userImage: userImage ? userImage : "",
            firstName,   
            lastName,
            role,
            email,
            password: bcrypt.hashSync(password, brcyptSalt)
        })
        res.json(newUserData);
    } catch (error) {
        res.status(422).json(error);
    }
};

export const login = async (req, res) => {
    const logData = req.body;
    const { email, password } = await logData;
    const userData = await User.findOne({ email });
    if(userData){
        const correctPass = bcrypt.compareSync(password, userData.password);
        if(correctPass){
            jwt.sign({ role: userData.role, firstName: userData.firstName, password: userData.password, lastName: userData.lastName, email: userData.email, userImage: userData.userImage, id: userData._id }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie("token", token);
                res.json(userData);
            });
        }else{
            res.json("Incorrect Password");
        }
    }else{
        res.json("User not found");
    }   
}

export const verifyUser = async (req, res) => {
    const { _id, password } = await req.body;
    const userData = await User.findById(_id);
    const correctPass = bcrypt.compareSync(password, userData.password);
    if(correctPass){
        res.json(userData);
    }else{
        res.json("Incorrect password");
    }  
}

export const logout = (req, res) => {
	res.cookie("token", "").json(true);
};