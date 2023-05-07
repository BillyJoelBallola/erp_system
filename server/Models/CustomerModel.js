import { Schema, model } from 'mongoose';

const CustomerSchema = new Schema({
    name: {type: String, required: true},
    code: {
        type: String,
    },
    business: {type: String, required: true},
    address: {
        street: {type: String, required: true},
        barangay: {type: String, required: true},
        city: {type: String, required: true},
        province: {type: String, required: true},
        country: {type: String, required: true},
    },
    contact:{
        email: {type: String},
        phoneNumber: {type: String, required: true},
    },
    order: {type: Number, default: 0},
});

export const Customer = model("Customer", CustomerSchema);