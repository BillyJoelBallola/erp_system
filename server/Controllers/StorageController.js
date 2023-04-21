import { Storage } from "../Models/StorageModel.js";

export const getAllStorage = async (req, res) => {
    try {
        const response = await Storage.find({});
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}