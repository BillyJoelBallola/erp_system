import { Router } from "express";
import { getUploadedImage, uploadImage } from "../Controllers/UploadController.js";
import multer from "multer";

const route = Router();
const photosMiddleware = multer({ dest: "uploads/" });

route.post("/upload_image", photosMiddleware.array("image", 100), uploadImage);
// route.get("/file/:filename", getUploadedImage);

export default route;