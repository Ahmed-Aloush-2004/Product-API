import express from "express";
import { Router } from "express";

import { authMid, authorizeRole } from "../middleware/authMid.js";
import {
  addBrand,
  deleteBrandById,
  getBrandById,
  getBrands,
} from "../controller/BrandController.js";
import { imageUploadFolder } from "../middleware/multerMid.js";

const router = Router();

router.get("/", authMid, getBrands);

router.get("/:id", authMid, getBrandById);

router.post(
  "/add",
  imageUploadFolder("brands"),
  authMid,
  authorizeRole("admin"),
  addBrand
);

router.delete("/:id", authMid, authorizeRole("admin"), deleteBrandById);

export default router;
