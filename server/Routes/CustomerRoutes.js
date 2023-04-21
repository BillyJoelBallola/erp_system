import { Router } from "express";
import { addCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from "../Controllers/CustomerController.js";

const route = Router();

route.post("/add_customer", addCustomer);
route.put("/update_customer", updateCustomer);
route.delete("/customer/:id", deleteCustomer);
route.get("/customers", getAllCustomers);
route.get("/customer/:id", getCustomerById);

export default route;

