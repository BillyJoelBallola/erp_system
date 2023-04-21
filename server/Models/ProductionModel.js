import { Schema, model } from "mongoose";

const ProductionSchema = new Schema({
    product: { 
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    dateFinish: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

export const Production = model("Production", ProductionSchema);