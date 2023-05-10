import { Router } from "express";
import { addPayslip, deletePayslip, getAllPayslip } from "../Controllers/PayslipController.js";

const route = Router();

route.post("/add_payslip", addPayslip);
route.get("/payslips", getAllPayslip);
route.delete("/payslip/:id", deletePayslip);

export default route;