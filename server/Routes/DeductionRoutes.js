import { Router } from "express";
import { getAllDeduction } from "../Controllers/DeductionController.js";

const route = Router();

route.get("/deductions", getAllDeduction);

export default route;