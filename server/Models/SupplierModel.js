import { Schema, model } from 'mongoose';

const SupplierSchema = new Schema({
    name: {type: String, required: true},
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
});

export const Supplier = model('Supplier', SupplierSchema);