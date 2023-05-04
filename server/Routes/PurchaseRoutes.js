import { Router } from "express";
import { addPurchase, deletePurchase, getAllPurchase, getPurchaseById, updatePurchase } from "../Controllers/PurchaseController.js";

const route = Router();

route.post("/add_purchase", addPurchase);
route.put("/update_purchase", updatePurchase);
route.delete("/purchase/:id", deletePurchase);
route.get("/purchases", getAllPurchase);
route.get("/purchases/:id", getPurchaseById);

export default route;