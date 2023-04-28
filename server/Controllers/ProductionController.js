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
                const prodQty = Number(productionData.quantity) * Number(qty);
                const totalQty = rawMaterialInfo.quantity - prodQty;
                if(rawMaterialInfo._id.toString() === rawId){
                    rawMaterialInfo.set({ quantity: totalQty });
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
    const { _id, product, quantity, dateFinish, status } = await req.body;
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
 
export const updateRawMaterialQty = async (req, res) => {
    const { _id, quantity } = await req.body;
    const productionInfo = await Production.findById(_id);
    const productInfo = await Product.findById(productionInfo.product);
    try {
        productInfo.rawMaterial.map(async ({ rawId, qty }) => {
            const rawMaterialInfo = await RawMaterials.findById(rawId);
            const oldProdQty = productionInfo.quantity * Number(qty);
            const oldSumQty = rawMaterialInfo.quantity + oldProdQty;
            const newProdQty = quantity * Number(qty);
            const totalQty =  oldSumQty - newProdQty;
            if(rawMaterialInfo._id.toString() === rawId){
                rawMaterialInfo.set({ quantity: totalQty });
                rawMaterialInfo.save();
            }
        });
        res.json(productInfo);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllProduction = async (req, res) => {
    try {
        const response = await Production.find({}).populate("product");
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
        const productInfo = await Production.findById(id).populate("product");
        if(productInfo){
            productInfo.product.rawMaterial.map(async ({ rawId, qty }) => {
                const rawMaterialInfo = await RawMaterials.findById(rawId);
                const prodQty = productInfo.quantity * Number(qty);
                const totalQty = rawMaterialInfo.quantity + prodQty;
                if(rawMaterialInfo._id.toString() === rawId){
                    rawMaterialInfo.set({ quantity: totalQty });
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
