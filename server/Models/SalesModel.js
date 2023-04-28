import { Schema, model } from 'mongoose';

const SalesSchema = new Schema({
    customers: {
        type: Schema.Types.ObjectId, 
        ref: "customers",
        required: true 
    },
    order: [
        {
            item: { 
                type: String, 
                required: true 
            },
            maesurement: {
                type: String,
                required: true 
            },
            price: {
                type: Number,
                required: true 
            },
            discount : {
                type: Number, 
            },
            quantity: {
                type: Number,
                required: true 
            },
            totalPrice: {
                type: Number,
                required: true 
            }
        }
    ],
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
    total: {
        type: Number,
    }
});

export const Sales = model("Sales", SalesSchema);  