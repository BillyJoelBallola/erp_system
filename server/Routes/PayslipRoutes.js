import { Router } from "express";
import { addPayslip, deletePayslip, getAllPayslip, getPayslipById, updatePayslip } from "../Controllers/PayslipController.js";

const route = Router();

route.post("/add_payslip", addPayslip);
route.put("/update_payslip", updatePayslip);
route.delete("/payslip/:id", deletePayslip);
route.get("/payslips", getAllPayslip);
route.get("/payslip/:id", getPayslipById);

export default route;