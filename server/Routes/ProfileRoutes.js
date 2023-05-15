import { Router } from "express";
import { profile, updateInfo, updatePassword, updateProfileImage } from "../Controllers/ProfileController.js";

const route = Router();

route.get("/profile", profile);
route.put("/update_img_profile", updateProfileImage);
route.put("/update_info_profile", updateInfo);
route.put("/update_password_profile", updatePassword);

export default route;