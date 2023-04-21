import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    rawMaterial: [Object],
    category: [String],
    maesurement: {
        type: String, 
        required: true, 
    },
    quantity: {
        type: Number, 
        default: 0,
    },
    price: {
        type: Number,
        required: true
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
})

export const Product = model("Product", ProductSchema);