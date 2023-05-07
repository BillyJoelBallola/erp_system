import { Purchase } from "../Models/PurchaseModel.js";
import { Supplier } from "../Models/SupplierModel.js";

export const addPurchase = async (req, res) => {
    const { supplier, order, datePurchase, discount, subTotal, total} = await req.body;
    const supplierInfo = await Supplier.findById(supplier);
    try {
        const response = await Purchase.create({
            supplier: supplier,
            order: order,
            datePurchase: datePurchase,
            payment: "Pending",
            discount: discount,
            subTotal: subTotal,
            total: total
        });
        supplierInfo.set({
            order: supplierInfo.order + 1
        });
        supplierInfo.save();
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const updatePurchase = async (req, res) => {
    const { id, _id, order, datePurchase, discount, subTotal, total} = await req.body;
    const purchaseInfo = await Purchase.findById(id);
    try {
        purchaseInfo.set({
            supplier: _id,
            order: order,
            datePurchase: datePurchase,
            discount: discount,
            subTotal: subTotal,
            total: total
        });
        purchaseInfo.save();
        res.json(purchaseInfo);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllPurchase = async (req, res) => {
    try {
        const response = await Purchase.find({}).populate("supplier");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getPurchaseById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Purchase.findById(id).populate("supplier");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deletePurchase = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Purchase.findByIdAndDelete(id);
        const supplierInfo = await Supplier.findById(response.supplier);
        supplierInfo.set({
            order: supplierInfo.order - 1
        });
        supplierInfo.save();
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}
