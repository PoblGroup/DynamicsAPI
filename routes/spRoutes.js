import express from "express";
import { uploadFile } from "../controllers/sp/fileController.js";
import multer from "multer";
import { v4 } from "uuid";

// Multer Config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${v4()}_${originalname}`);
//   },
// });
// const upload = multer({ storage });
const upload = multer();

// const obj = {
//   test: 1,
//   test2: 2,
//   test3: [
//     { id: 1, name: "test", ref: "ref" },
//     { id: 2, name: "test", ref: "ref" },
//   ],
// };

// const objString = JSON.stringify(obj);
// console.log(objString);

const router = express.Router();

// Files
router.route("/files").get().post(upload.single("image"), uploadFile);

export default router;
