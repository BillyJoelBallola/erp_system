import moment from "moment";
import { Payslip } from "../Models/PayslipModel.js";

export const addPayslip = async (req, res) => {
    const { employee, month, year, gross, deduction, netPay } = await req.body;
    try {
        const newPayslip = await Payslip.create({
            employee: employee,
            payment: "Unpaid",
            month: month,
            year: year,
            gross: gross,
            deduction: deduction,
            netPay: netPay
        })
        res.json(newPayslip);
    } catch (error) {
        res.json(error.message);
    }
}   

export const getAllPayslip = async (req, res) => {
    const [date, time] = moment(Date.now()).format().split("T"); 
    const [year, month, day] = date.split("-");
    try {
        const response = await Payslip.find({ month: month }).populate("employee");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deletePayslip = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Payslip.findByIdAndDelete(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}