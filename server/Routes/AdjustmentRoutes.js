import { Router } from "express";
import { addAdjustment, deleteAdjustment, getAdjustmentById, getAllAdjustment, updateAdjustment } from "../Controllers/AdjustmentController.js";

const route = Router();

route.post("/add_adjustment", addAdjustment);
route.post("/update_adjustment", updateAdjustment);
route.get("/adjustments", getAllAdjustment);
route.get("/adjustment/:id", getAdjustmentById);
route.delete("/adjustment/:id", deleteAdjustment);

export default route;