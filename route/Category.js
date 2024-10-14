import express from "express";
import { Router } from "express";

import Category from "../model/Category.js";
import {
  addCategory,
  deleteCategoryById,
  getCategories,
  getCategoryById,
} from "../controller/CategoryController.js";
import { authMid, authorizeRole } from "../middleware/authMid.js";

const router = Router();

router.get("/", authMid, getCategories);

router.get("/:id", authMid, getCategoryById);

router.post("/add", authMid, authorizeRole("admin"), addCategory);

router.delete("/:id", authMid, authorizeRole("admin"), deleteCategoryById);

export default router;
