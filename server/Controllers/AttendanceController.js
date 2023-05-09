import { Attendance } from "../Models/AttendanceModel.js";
import { Employee } from "../Models/EmployeeModel.js";
import moment from "moment";

export const timeInAttendance = async (req, res) => {
    const { code } = await req.body; 
    const employeeInfo = await Employee.findOne({ code: code });
    try {
        const response = await Attendance.create({
            employee: employeeInfo._id,
            timeIn: Date.now(),
            timeOut: "",
        })
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const timeOutAttendance = async (req, res) => {
    const { id } = await req.body;
    const currentDate = Date.now();
    const attendanceInfo = await Attendance.findById(id);
    try {
        attendanceInfo.set({
            timeOut: currentDate
        });
        attendanceInfo.save();
        res.json(attendanceInfo);
    } catch (error) {
        res.json(error.message);
    }
} 

export const getCurrentAttendance = async (req, res) => {
    const [date, time] = moment(Date.now()).format().split("T");
    try {
        const response = await Attendance.find({ timeIn: { $gte: date.toString() } }).populate("employee");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteAttendance = async (req, res) => {
    const { id } = await req.params;
    try{
        const response = await Attendance.findByIdAndDelete(id);
        res.json(response);
    }catch(error){
        res.json(error.message);
    }
}