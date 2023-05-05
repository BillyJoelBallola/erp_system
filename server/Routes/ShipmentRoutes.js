import { Router } from 'express';
import { addShipment, deleteShipment, finishShipment, getAllShipment, getShipmentById, updateShipment } from '../Controllers/ShipmentController.js';

const route = Router();

route.post("/add_shipment", addShipment);
route.put("/update_shipment", updateShipment);
route.put("/finish_shipment", finishShipment);
route.delete("/shipment/:id", deleteShipment);
route.get("/shipment/:id", getShipmentById);
route.get("/shipments", getAllShipment);

export default route;