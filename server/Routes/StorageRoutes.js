import { Router } from "express";
import { getAllStorage } from "../Controllers/StorageController.js";

const route = Router();

route.get("/storages", getAllStorage);

export default route;