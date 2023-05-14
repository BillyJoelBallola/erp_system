import fs from "fs";
import { dirname } from "path";

console.log(__dirname);

export const uploadImage = async (req, res) => {
    const files = await req.files;
    try {
        const { path, originalname } = files[0];
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath); 
        res.json(newPath.replace("uploads", ""));
    } catch (error) {
        res.json(error.message);
    }
}

// export const getUploadedImage = async (req, res) => {
//     const { filename } = await req.params;
//     try {
//         res.sendFile(__dirname, `/uploads/${filename}`);
//     } catch (error) {
//         res.json(error.message);
//     }
// }