import { Sales } from "../Models/SalesModel.js";
import { Shipment } from "../Models/ShipmentModel.js";

export const addShipment = async (req, res) => {
    const { salesOrder, dateShipment, address } = await req.body;
    const order = await Sales.findById(salesOrder);
    try {
        const shipment = await Shipment.create({
            salesOrder: salesOrder,
            dateShipment: dateShipment,
            address: address,
            status: "In progress"
        });
        order.set({
            shipment: "In progress"
        });
        order.save();
        res.json(shipment);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateShipment = async (req, res) => {
    const { id, salesOrder, dateShipment, address } = await req.body;
    const shipmentInfo = await Shipment.findById(id);
    try {
        shipmentInfo.set({
            salesOrder: salesOrder,
            dateShipment: dateShipment,
            address: address,
        })
        shipmentInfo.save();
        res.json(shipmentInfo);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllShipment = async (req, res) => {
    try {
        const response = await Shipment.find({}).populate("salesOrder");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getShipmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Shipment.findById(id).populate("salesOrder");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteShipment = async (req, res) => {
    const { id } = req.params;
    const { salesOrder } = await Shipment.findById(id);
    const order = await Sales.findById(salesOrder);
    try {
        const response = await Shipment.findByIdAndDelete(id);
        order.set({
            shipment: "Pending"
        });
        order.save();
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const finishShipment = async (req, res) => {
    const { orderId, shipmentId } = await req.body;
    const shipmentInfo = await Shipment.findById(shipmentId).populate("salesOrder");
    const order = await Sales.findById(orderId);
    try {
        shipmentInfo.set({
            status: "Completed"
        });
        shipmentInfo.save();
        order.set({
            shipment: "Completed"
        });
        order.save();
        res.json(shipmentInfo)
    } catch (error) {
        res.json(error.message);
    }
}