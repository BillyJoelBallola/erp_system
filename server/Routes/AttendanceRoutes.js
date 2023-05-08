import { Router } from "express";
import { getAllAttendance, timeInAttendance } from "../Controllers/AttendanceController.js";

const route = Router();

route.post("/timeIn_attendance", timeInAttendance);
route.get("/attendance", getAllAttendance);

export default route;