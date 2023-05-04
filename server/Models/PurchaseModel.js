import { Schema, model } from "mongoose";

const PurchaseSchema = new Schema({
    supplier: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
    order: [Object],
    datePurchase: {
        type: Date,
        required: true
    },
    payment: {
        type: String,
    },
    discount:{
        type: Number,
    },
    subTotal:{
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

export const Purchase = model("Purchase", PurchaseSchema);