import { Position } from "../Models/PositionModel.js";

export const getAllPositions = async (req, res) => {
    try {
       res.json(await Position.find({})); 
    } catch (error) {
        res.json(error.message);
    }
} 