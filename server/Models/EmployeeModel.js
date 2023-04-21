import { Schema, model } from 'mongoose';

const EmployeeSchema = new Schema({
    name: { type: String, required: true},
    dob: { type: Date, required: true},
    age: { type: Number, required: true},
    gender: { type: String, required: true},
    address: {
        street: { type: String, required: true},
        barangay: { type: String, required: true},
        city: { type: String, required: true},
        province: { type: String, required: true},
        country: { type: String, required: true}
    },
    contact: {
        email: { type: String },
        phoneNumber: {type: String, required: true }
    },
    position: { type: Schema.Types.ObjectId, ref: "Position", required: true },
    qrCode: { type: String, required: true },
    code: { type: String, required: true }
});

export const Employee = model("Employee", EmployeeSchema);