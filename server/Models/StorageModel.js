import { Schema, model } from "mongoose";

const StorageSchema = new Schema({
    name: { type: String,  required: true }
})

export const Storage = model("Storage", StorageSchema);