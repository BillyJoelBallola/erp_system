import { Router } from "express";
import { addRawMaterial, deleteRawMaterial, getAllRawMaterial, getRawMaterialById, updateRawMaterial } from "../Controllers/RawMaterialController.js";

const route = Router();

route.post("/add_raw-material", addRawMaterial);
route.put("/update_raw-material", updateRawMaterial);
route.delete("/raw-material/:id", deleteRawMaterial)
route.get("/raw-materials", getAllRawMaterial);
route.get("/raw-material/:id", getRawMaterialById);

export default route;