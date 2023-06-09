import { Schema, model } from 'mongoose';

const SalesSchema = new Schema({
    customers: {
        type: Schema.Types.ObjectId, 
        ref: "Customer",
        required: true 
    },
    order: [Object],
    dateOrdered: {
        type: Date,
        required: true
    },
    shipment: {
        type: String,
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

export const Sales = model("Sales", SalesSchema);  