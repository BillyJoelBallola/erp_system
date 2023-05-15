import { Router } from "express";
import { login, logout, addUser, verifyUser } from "../Controllers/AuthController.js";

const route = Router();

route.post("/add_user", addUser);
route.post("/login", login);
route.post("/logout", logout);
route.post("/verify_user", verifyUser);

export default route;