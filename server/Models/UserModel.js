import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    userImage: { type: String },
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    role: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    userAccess: [Object]
})

export const User = model("User", UserSchema);