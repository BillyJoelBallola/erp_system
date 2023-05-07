import { Schema, model } from "mongoose";

const AdjustmentSchema = new Schema({
    item: {
        type: Object,
    },
    remarks: {
        type: String,
    },
    dateAdjustment: {
        type: Date,
        default: Date.now()
    }
});

export const Adjustment = model("Adjustment", AdjustmentSchema);