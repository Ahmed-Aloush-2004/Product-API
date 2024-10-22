import express from "express";
import {
  addItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from "../controller/ItemSliderController.js";
import { imageUploadFolder } from "../middleware/multerMid.js";
import { authMid, authorizeRole } from "../middleware/authMid.js";

const router = express.Router();

router.get("/", getItems);

router.get("/:id", getItemById);

router.post(
  "/add",
  imageUploadFolder("ImageSlider"),
  //   authMid,
  //   authorizeRole("admin"),
  addItem
);

router.put(
  "/:id",
  imageUploadFolder("ImageSlider"),
  //   authMid,
  //   authorizeRole("admin"),
  updateItem
);

router.delete(
  "/:id",
  //  authMid, authorizeRole("admin"),
  deleteItem
);

export default router;
