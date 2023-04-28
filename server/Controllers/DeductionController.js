import { Deduction } from "../Models/DeductionModel.js";

export const getAllDeduction = async (req, res) => {
    try {
        const response = await Deduction.find({});
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

