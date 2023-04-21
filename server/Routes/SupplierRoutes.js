import { Router } from 'express';
import { addSupplier, updateSupplier, deleteSupplier, getAllSupplier, getSupplierById } from '../Controllers/SupplierController.js';

const route = Router();

route.post("/add_supplier", addSupplier);
route.put("/update_supplier", updateSupplier);
route.delete("/supplier/:id", deleteSupplier);
route.get("/suppliers", getAllSupplier);
route.get("/supplier/:id", getSupplierById);

export default route;