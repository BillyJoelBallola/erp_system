import { Sales } from "../Models/SalesModel.js";
import { Product } from "../Models/ProductModel.js";
import { Customer } from "../Models/CustomerModel.js";

export const addSalesOrder  = async (req, res) => {
    const { customer, order, dateOrdered, discount, subTotal, total} = await req.body;
    const customerInfo = await Customer.findById(customer);
    try {
        const response = await Sales.create({
            customers: customer,
            order: order,
            dateOrdered: dateOrdered,
            shipment: "Pending",
            payment: "Pending",
            discount: discount,
            subTotal: subTotal,
            total: total
        });
        customerInfo.set({
            order: customerInfo.order + 1  
        });
        customerInfo.save();
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateSalesOrder = async (req, res) => {
    const { id, _id, order, dateOrdered, discount, subTotal, total } = await req.body;
    const salesOrderInfo = await Sales.findById(id);
    try {
        salesOrderInfo.set({
            customers: _id,
            order: order,
            dateOrdered: dateOrdered,
            discount: discount,
            subTotal: subTotal,
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
    const { id } = await req.params;
    try {
        const response = await Sales.findById(id).populate("customers");
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteSales = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Sales.findByIdAndDelete(id);
        const customerInfo = await Customer.findById(response.customers);
        customerInfo.set({
            order: customerInfo.order - 1,
        });
        customerInfo.save();
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const reduceQuantity = async (req, res) => {
    const { order } = await req.body;
    const productInfo = await Product.find({});
    try {
        order.map((order) => {
            productInfo.map((product) => {
                if (product._id.toString() === order.item){
                    const newQty = product.quantity - order.qty;
                    product.set({ quantity: newQty });
                    product.save();
                }
            })
        })
        res.json(productInfo)
    } catch (error) {
        res.json(error.message);
    }
} 

export const cancelOrder = async (req, res) => {
    const { id } = await req.params;
    try {
        const salesOrderInfo = await Sales.findById(id);
        const products = await Product.find({});
        salesOrderInfo.order.map((order) => {
            products.map((product) => {
                if(product._id.toString() === order.item){
                    product.set({ quantity: product.quantity + Number(order.qty)});
                    product.save();
                }
            })
        })
        res.json(products);
    } catch (error) {
        res.json(error.message);
    }
}