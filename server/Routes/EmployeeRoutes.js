import { Router } from "express";
import { addEmployee, deleteEmployee, getAllEmployees, getEmployeeById, getEmployeeByQrCode, updateEmployee } from "../Controllers/EmployeeController.js";

const route = Router();

route.post("/add_employee", addEmployee);
route.put("/update_employee", updateEmployee);
route.delete("/employee/:id", deleteEmployee);
route.get("/employees", getAllEmployees);
route.get("/employee/:id", getEmployeeById);
route.get("/qr_employee/:code", getEmployeeByQrCode);

export default route;