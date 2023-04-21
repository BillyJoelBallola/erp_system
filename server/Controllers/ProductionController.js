import { Product } from "../Models/ProductModel.js";
import { Production } from "../Models/ProductionModel.js";
import { RawMaterials } from "../Models/RawMaterialModel.js";

export const addProduction = async (req, res) => {
    const productionData = await req.body;
    const { product, quantity, dateFinish, status } = await productionData;
    try {
        const productionInfo = await Production.create({
            product: product,
            quantity: quantity,
            dateFinish: dateFinish,
            status: status
        });
        const productInfo = await Product.findById(productionInfo.product);
        if(productInfo){
            productInfo.rawMaterial.map(async ({ rawId, qty }) => {
                const rawMaterialInfo = await RawMaterials.findById(rawId);
                const { quantity, _id } = rawMaterialInfo;
                if(_id.toString() === rawId){
                    rawMaterialInfo.set({
                        quantity: quantity - qty,
                    });
                    rawMaterialInfo.save();
                }
            });
        }
        res.json(productionInfo);
    } catch (error) {
        res.json(error.message);
    }
};

export const updateProduction = async (req, res) => {
    const productionData = await req.body;
    const { _id, product, quantity, dateFinish, status } = await productionData;
    const productionInfo = await Production.findById(_id);
    try {
        productionInfo.set({
            product: product,
            quantity: quantity,
            dateFinish: dateFinish,
            status: status
        });
        productionInfo.save();
        res.json(productionInfo);
    } catch (error) {
        res.json(error.message);
    }
};

export const getAllProduction = async (req, res) => {
    try {
        const response = await Production.find({}).populate("product");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
};

export const getProductionById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Production.findById(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
};

export const deleteProduction = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Production.findByIdAndDelete(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
};

export const cancelProduction = async (req, res) => {
    const { id } = req.params;
    try {
        const { product } = await Production.findById(id).populate("product");
        if(product){
            product.rawMaterial.map(async ({ rawId, qty }) => {
                const rawMaterialInfo = await RawMaterials.findById(rawId);
                const { quantity, _id } = rawMaterialInfo;
                if(_id.toString() === rawId){
                    rawMaterialInfo.set({
                        quantity: Number(quantity) + Number(qty),
                    });
                    rawMaterialInfo.save();
                }
            });
            const response = await Production.findByIdAndDelete(id);
            res.json(response);
        }
        
    } catch (error) {
        res.json(error.message);
    }
};
