import { Router } from "express";
import { login, logout, addUser } from "../Controllers/AuthController.js";

const route = Router();

route.post("/add_user", addUser);
route.post("/login", login);
route.post("/logout", logout);

export default route;