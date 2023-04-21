import { RawMaterials } from "../Models/RawMaterialModel.js";

export const addRawMaterial = async (req, res) => {
    const materialData = await req.body;
    const { name, maesurement, category, quantity, storage } = await materialData;
    RawMaterials.create({
        name: name,
        maesurement: maesurement,
        category: category,
        quantity: quantity,
        storage: storage
    }).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err.message);
    })  
}

export const updateRawMaterial = async (req, res) => {
    const materialData = await req.body;
    const { _id, name, maesurement, category, quantity, storage } = await materialData;
    const rawMaterialInfo = await RawMaterials.findById(_id);
    try {
        rawMaterialInfo.set({
            name: name,
            maesurement: maesurement,
            category: category,
            quantity: quantity,
            storage: storage
        })
        rawMaterialInfo.save();
        res.json(rawMaterialInfo);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllRawMaterial = async (req, res) => {
    try {
        const response = await RawMaterials.find({}).populate("storage");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getRawMaterialById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await RawMaterials.findById(id).populate("storage");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteRawMaterial = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await RawMaterials.findByIdAndDelete(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
};



