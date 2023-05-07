import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    timeIn: {
        type: Timestamp,
    },
    timeIn: {
        type: Timestamp,
    },
    numHour: {
        type: Number,
    }
});

export const Attendance = model("Attendance", AttendanceSchema);