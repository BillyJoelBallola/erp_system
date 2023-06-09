import { Router } from 'express';
import { addSalesOrder, cancelOrder, deleteSales, getAllSales, getSalesById, reduceQuantity, updateSalesOrder } from '../Controllers/SalesController.js';

const route = Router();

route.post("/add_sales", addSalesOrder);
route.put("/update_sales", updateSalesOrder);
route.put("/reduce_sales_product_qty", reduceQuantity);
route.delete("/sales/:id", deleteSales);
route.delete("/cancel_order/:id", cancelOrder);
route.get("/sales", getAllSales);
route.get("/sales/:id", getSalesById);

export default route;