import { Router } from "express";
import { addProduction, cancelProduction, deleteProduction, getAllProduction, getProductionById, updateProduction } from "../Controllers/ProductionController.js";

const route = Router();

route.post("/add_production", addProduction);
route.put("/update_production", updateProduction);
route.delete("/cancel_production/:id", cancelProduction);
route.delete("/production/:id", deleteProduction);
route.get("/productions", getAllProduction);
route.get("/production/:id", getProductionById);

export default route;