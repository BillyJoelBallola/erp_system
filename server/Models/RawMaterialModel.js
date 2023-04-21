import { Schema, model } from "mongoose";

const RawMaterialSchema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    maesurement: {
        type: String, 
        required: true,
    },
    category: [String],
    quantity: {
        type: Number, 
        required: true,
    },
    storage: {
        type: Schema.Types.ObjectId, 
        ref: "Storage", 
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

export const RawMaterials = model("RawMaterials", RawMaterialSchema);