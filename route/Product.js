import express from "express";
import { Router } from "express";
import { authMid,authorizeRole } from "../middleware/authMid.js";
import { imageUploadFolder, upload } from "../middleware/multerMid.js";
import multer from "multer";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controller/ProductController.js";

const router = Router();

// POST /api/products/upload - upload image

// router.post("/upload", upload.single("image"), (req, res) => {
//   // Everything went fine, return success response
//   if (!req.file) {
//     return res.status(400).json({ message: "Please upload a file" });
//   }

//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
//     req.file.filename
//   }`;
//   return res
//     .status(200)
//     .json({ message: "File uploaded successfully!", image: imageUrl });
// });
// router.post("/uploads", upload.array("image", 3), (req, res) => {
//   // Check if req.files is populated with an array of uploaded files
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ message: "Please upload at least one file" });
//   }

//   // Map through the array to generate URLs for each uploaded file
//   const imageArray = req.files.map((file) => {
//     return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
//   });

//   return res.status(200).json({
//     message: "Files uploaded successfully!",
//     images: imageArray,
//   });
// });

// const uploadSingle = upload.single("image");
// router.post("/upload", loggedIn, function (req, res, next) {
//   uploadSingle(req, res, function (err) {
//     console.log(res);
//     if (err) {
//       return res.status(400).json({ message: err.message });
//     }
//     return res
//       .status(200)
//       .json({ message: "File Uploaded!", image: req.file.filename });
//   });
// });

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/add",
  // authMid,
  // authorizeRole("admin"),
  imageUploadFolder("products"),
  addProduct
);

router.put(
  "/:id",
  // authMid,
  // authorizeRole("admin"),
  imageUploadFolder("products"),
  updateProduct
);

router.delete("/:id", authMid, authorizeRole("admin"), deleteProduct);

export default router;
