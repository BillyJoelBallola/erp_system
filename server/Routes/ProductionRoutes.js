import { Router } from "express";
import { addProduction, cancelProduction, deleteProduction, getAllProduction, updateProduction, updateRawMaterialQty } from "../Controllers/ProductionController.js";

const route = Router();

route.post("/add_production", addProduction);
route.put("/update_production", updateProduction);
route.put("/update_production_raw_material", updateRawMaterialQty);
route.delete("/cancel_production/:id", cancelProduction);
route.delete("/production/:id", deleteProduction);
route.get("/productions", getAllProduction);

export default route;