import { Router } from "express";
import { getAllPositions } from "../Controllers/PositionController.js"

const route = Router();

route.get("/positions", getAllPositions);

export default route;