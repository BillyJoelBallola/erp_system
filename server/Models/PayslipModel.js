import { Schema, model } from "mongoose";

const PayslipSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    payment: {
        type: String,
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    gross: {
        type: Number,
        required: true
    },
    deduction: {
        type: Number,
        required: true
    },
    netPay: {
        type: Number,
        required: true
    }
});

export const Payslip = model("Payslip", PayslipSchema);