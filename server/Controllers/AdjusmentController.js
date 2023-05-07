import { Adjustment } from "../Models/AdjustmentModel.js";
import { Product } from "../Models/ProductModel.js";
import { RawMaterials } from "../Models/RawMaterialModel.js";

export const addAdjustment = async (req, res) => {
    const { item, remarks } = await req.body;
    const productInfo = await Product.find({});
    const rawMaterialInfo = await RawMaterials.find({});
    try {
        productInfo.map((product) => {
            if(product._id.toString() === item.itemId){
                product.set({
                    quantity: item.newQty
                })
                product.save();
            }else{
                return;
            }
        });

        rawMaterialInfo.map((raw) => {
            if(raw._id.toString() === item.itemId){
                raw.set({
                    quantity: item.newQty
                })
                raw.save();
            }else{
                return;
            }
        }); 

        const adjustmentInfo = await Adjustment.create({
            item: item,
            remarks: remarks
        })
        res.json(adjustmentInfo);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateAdjustment = async (req, res) => {
    const { _id, item, remarks } = await req.body;
    const adjustmentInfo = await Adjustment.findById(_id);    
    const productInfo = await Product.find({});
    const rawMaterialInfo = await RawMaterials.find({});
    try {
        productInfo.map((product) => {
            if(product._id.toString() === item.itemId){
                product.set({
                    quantity: item.newQty
                })
                product.save();
            }else{
                return;
            }
        });

        rawMaterialInfo.map((raw) => {
            if(raw._id.toString() === item.itemId){
                raw.set({
                    quantity: item.newQty
                })
                raw.save();
            }else{
                return;
            }
        }); 

        adjustmentInfo.set({
            item: item,
            remarks: remarks
        });
        adjustmentInfo.save();
        res.json(adjustmentInfo);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllAdjustment = async (req, res) => {
    try {
        const response = await Adjustment.find({});
        res.json(response)
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteAdjustment = async (req, res) => { 
    const { id } = await req.params;
    const adjustmentInfo = await Adjustment.findById(id);
    const productInfo = await Product.find({});
    const rawMaterialInfo = await RawMaterials.find({});
    try {
        productInfo.map((product) => {
            if(product._id.toString() === adjustmentInfo.item.itemId){
                product.set({
                    quantity: adjustmentInfo.item.oldQty
                })
                product.save();
            }else{
                return;
            }
        })

        rawMaterialInfo.map((raw) => {
            if(raw._id.toString() === adjustmentInfo.item.itemId){
                raw.set({
                    quantity: adjustmentInfo.item.oldQty
                })
                raw.save();
            }else{
                return;
            }
        }) 

        const response = await Adjustment.findByIdAndDelete(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAdjustmentById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Adjustment.findById(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}