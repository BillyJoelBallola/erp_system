import moment from "moment";
import { Payslip } from "../Models/PayslipModel.js";

export const addPayslip = async (req, res) => {
    const { employee, monthYear, earning, gross, deduction, netPay } = await req.body;
    try {
        const newPayslip = await Payslip.create({
            employee: employee,
            payment: "Unpaid",
            monthYear: monthYear,
            earning: earning,
            gross: gross,
            deduction: deduction,
            netPay: netPay
        })
        res.json(newPayslip);
    } catch (error) {
        res.json(error.message);
    }
}   

export const updatePayslip = async (req, res) => {
    const { id, monthYear, earning, gross, deduction, netPay} = await req.body; 
    const payslipData = await Payslip.findById(id);  
    try{
        payslipData.set({
            monthYear: monthYear,
            earning: earning,
            gross: gross,
            deduction: deduction,
            netPay: netPay
        })
        payslipData.save();
        res.json(payslipData);
    }catch(error){
        res.json(error.message);
    }
}

export const getAllPayslip = async (req, res) => {
    const [date, time] = moment(Date.now()).format().split("T"); 
    const [year, month, day] = date.split("-");
    try {
        const response = await Payslip.find({ monthYear: { $gt: month.toString() } }).populate("employee");
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

export const getPayslipById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Payslip.findById(id).populate("employee");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
} 