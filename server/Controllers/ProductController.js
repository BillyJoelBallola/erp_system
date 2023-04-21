import { Product } from "../Models/ProductModel.js";
import { Production } from "../Models/ProductionModel.js";

export const addProduct = async (req, res) => {
    const productData = await req.body;
    const { name, rawMaterial, maesurement, price, category, quantity, storage } = await productData;
    Product.create({
        name: name,
        rawMaterial: rawMaterial,
        category: category,
        maesurement: maesurement,
        quantity: quantity ? quantity : 0,
        price: price,
        storage: storage
    }).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    })
}

export const updateProduct = async (req, res) => {
    const productData = await req.body;
    const { _id, name, rawMaterial, maesurement, price, category, quantity, storage } = await productData;
    const productInfo = await Product.findById(_id);
    try {
        productInfo.set({
            name: name,
            rawMaterial: rawMaterial,
            category: category,
            maesurement: maesurement,
            quantity: quantity ? quantity : 0,
            price: price,
            storage: storage
        })
        productInfo.save();
        res.json(productInfo);
    } catch (error) {
        res.json(error.message);
    }
} 

export const getProduct = async (req, res) => {
    try{
        const response = await Product.find({});
        res.json(response);
    }catch(error){
        res.json(error.message);
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Product.findById(id).populate("storage");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Product.findByIdAndDelete(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateQuantity = async (req, res) => {
    const { qty, productionId, productId } = await req.body;
    const productInfo = await Product.findById(productId);
    const { quantity } = productInfo;
    const productionInfo = await Production.findById(productionId);
    try {
        productInfo.set({ quantity: quantity + qty });
        productInfo.save();
        productionInfo.set({ status: "Completed" });
        productionInfo.save();
        res.json({ productInfo, productionInfo });
    } catch (error) {
        res.json(error.message);
    }
}