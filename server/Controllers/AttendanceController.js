import { Attendance } from "../Models/AttendanceModel.js";
import { Employee } from "../Models/EmployeeModel.js";

import moment from "moment";

export const timeInAttendance = async (req, res) => {
    const { code } = await req.body; 
    const currentDate = moment(Date.now()).format();
    const [date, time] = currentDate.split("T");
    const employeeInfo = await Employee.findOne({ code: code });
    const currentAttendance = await Attendance.find({});
    // try {
    //     console.log(currentAttendance);
        // if(employeeInfo){
        //     const response = await Attendance.create({
        //         employee: employeeInfo._id,
        //         timeIn: Date.now()
        //     })
        //     res.json(response);
        // }
    // } catch (error) {
    //     res.json(error.message);
    // }
}

export const getAllAttendance = async (req, res) => {
    try {
        const response = await Attendance.find({}).populate("employee");
        res.json(response); 
    } catch (error) {
        res.json(error.message);
    }
}