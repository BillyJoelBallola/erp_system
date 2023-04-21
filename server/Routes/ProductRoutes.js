import { Router } from "express";
import { addProduct, deleteProduct, getProduct, getProductById, updateProduct, updateQuantity} from "../Controllers/ProductController.js";

const route = Router();

route.post("/add_product", addProduct);
route.put("/update_product", updateProduct);
route.delete("/product/:id", deleteProduct);
route.get("/products", getProduct);
route.get("/product/:id", getProductById);
route.put("/update_qty_product", updateQuantity);

export default route;   