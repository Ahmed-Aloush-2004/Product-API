import ItemSlider from "../model/ItemSlider.js";
import { deleteImage } from "../utils/deleteImage.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Recreate `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function getItems(req, res) {
  try {
    const items = await ItemSlider.find();
    return res.status(200).json({ data: items });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function getItemById(req, res) {
  const id = req.params.id;
  try {
    const item = await ItemSlider.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found!" });

    return res.status(200).json({ item });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function addItem(req, res) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }
  try {
    const image_url = `${req.protocol}://${req.get("host")}/uploads/${
      req.imageFolder
    }/${req.file.filename}`;

    const item = new ItemSlider({ title, description, image_url });
    await item.save();
    return res.status(200).json({ message: "Item created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function updateItem(req, res) {
  const id = req.params.id;
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }
  try {
    const item = await ItemSlider.findById(id);

    if (!item) return res.status(404).json({ message: "Item not found!" });

    if (req.file && item.image_url) {
      deleteImage(item.image_url);
    }

    const image_url = `${req.protocol}://${req.get("host")}/uploads/${
      req.imageFolder
    }/${req.file.filename}`;

    await ItemSlider.updateOne(
      { _id: id },
      { $set: { title, description, image_url } }
    );
    // item.title = title;
    // item.description = description;
    // item.image = image;
    // await item.save();

    return res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function deleteItem(req, res) {
  const id = req.params.id;
  try {
    const item = await ItemSlider.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found!" });
    if (item.image_url) {
      deleteImage(item.image_url);
    }
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}
