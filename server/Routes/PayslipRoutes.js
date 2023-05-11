import { Router } from "express";
import { addPayslip, deletePayslip, getAllPayslip, getPayslipById } from "../Controllers/PayslipController.js";

const route = Router();

route.post("/add_payslip", addPayslip);
route.delete("/payslip/:id", deletePayslip);
route.get("/payslips", getAllPayslip);
route.get("/payslip/:id", getPayslipById);

export default route;