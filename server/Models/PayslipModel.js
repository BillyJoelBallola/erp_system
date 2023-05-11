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
    earning: {
        type: Number,
    },
    monthYear: {
        type: Date,
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