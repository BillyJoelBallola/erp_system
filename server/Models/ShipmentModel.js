import { Schema, model } from 'mongoose';

const ShipmentSchema = new Schema({
    salesOrder: {
        type: Schema.Types.ObjectId,
        ref: "Sales",
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dateShipment: {
        type: Date,
        required: true
    },
    status: {
        type: String
    }
});

export const Shipment = model("Shipment", ShipmentSchema);