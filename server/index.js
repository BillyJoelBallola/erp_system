import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import AuthRoutes from "./Routes/AuthRoutes.js";
import ProfileRoutes from "./Routes/ProfileRoutes.js";
import CustomerRoutes from "./Routes/CustomerRoutes.js";
import SupplierRoutes from "./Routes/SupplierRoutes.js";
import PositionRoutes from "./Routes/PositionRoutes.js";
import EmployeeRoutes from "./Routes/EmployeeRoutes.js";
import RawMaterialRoutes from "./Routes/RawMaterialRoutes.js";
import StorageRoutes from "./Routes/StorageRoutes.js";
import ProductRoutes from "./Routes/ProductRoutes.js";
import ProductionRoutes from "./Routes/ProductionRoutes.js";
import SalesRoutes from "./Routes/SalesRoutes.js";
import DeductionRoutes from "./Routes/DeductionRoutes.js";
import PurchaseRoutes from "./Routes/PurchaseRoutes.js";
import ShipmentRoutes from "./Routes/ShipmentRoutes.js";

import './config.js'
import './dbConnect.js';

import { dirname } from "path";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(dirname("/uploads")));
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));

app.use(AuthRoutes);
app.use(ProfileRoutes);
app.use(CustomerRoutes);
app.use(SupplierRoutes);
app.use(PositionRoutes);
app.use(EmployeeRoutes);
app.use(RawMaterialRoutes);
app.use(StorageRoutes);
app.use(ProductRoutes);
app.use(ProductionRoutes);
app.use(SalesRoutes);
app.use(DeductionRoutes);
app.use(PurchaseRoutes);
app.use(ShipmentRoutes);

const PORT = process.env.SERVER_PORT || 4000;

app.listen(PORT, () => console.log(`Server runnning on port ${PORT}`));