import { Schema, model } from 'mongoose';

const SupplierSchema = new Schema({
    name: {type: String, required: true},
    business: {type: String, required: true},
    address: {
        street: {type: String, required: true},
        barangay: {type: String},
        city: {type: String, required: true},
        province: {type: String, required: true},
        country: {type: String, required: true},
    },
    contact:{
        email: {type: String},
        phoneNumber: {type: String, required: true},
    },
    order: { type: Number, default: 0 }
});

export const Supplier = model('Supplier', SupplierSchema);