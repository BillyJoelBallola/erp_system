import { Sales } from "../Models/SalesModel.js";
import { Product } from "../Models/ProductModel.js";

export const addSalesOrder  = async (req, res) => {
    const { customer, order, dateOrdered, payment, total} = req.body;
    try {
        const response = await Sales.create({
            customer: customer,
            order: order,
            dateOrdered: dateOrdered,
            shipment: "Pending",
            payment: "Pending",
            total: total
      
        });
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateSalesOrder = async (req, res) => {
    const { _id, customer, order, shipment, dateOrdered, payment, total } = req.body;
    const salesOrderInfo = await Sales.findById(_id);
    try {
        salesOrderInfo.set({
            customer: customer,
            order: order,
            dateOrdered: dateOrdered,
            shipment: shipment,
            payment: payment,
            total: total
        })
        salesOrderInfo.save();
        res.json(salesOrderInfo);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllSales = async (req, res) => {
    try {
        const response = await Sales.find({}).populate("customers");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getSalesById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Sales.findById(id).populate("customers");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteSales = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Sales.findByIdAndDelete(id);
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const reduceQuantity = async (req, res) => {
    const { item, quantity } = await req.body;
    const productInfo = await Product.find({});
    try {
        productInfo.map((product) => {
            if(product._id.toString() === item){
                productInfo.set({ quantity: quantity });
                productInfo.save();
            }
        })
        res.json(productInfo);
    } catch (error) {
        res.json(error.message);
    }
} 