import { Router } from "express";
import { deleteAttendance, getAttendanceById, getCurrentAttendance, timeInAttendance, timeOutAttendance } from "../Controllers/AttendanceController.js";

const route = Router();

route.post("/timeIn_attendance", timeInAttendance);
route.put("/timeOut_attendance", timeOutAttendance);
route.delete("/attendance/:id", deleteAttendance);
route.get("/current_attendance", getCurrentAttendance);
route.get("/date_id_attendance/:employeeId", getAttendanceById);

export default route;