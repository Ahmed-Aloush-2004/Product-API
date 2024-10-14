import Product from "../model/Product.js";
import { deleteImage } from "../utils/deleteImage.js";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getProducts(req, res) {
  try {
    const products = await Product.find().populate("category");
    return res.status(200).json({ data: products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function getProductById(req, res) {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "product not found!" });
    return res.status(200).json({ data: product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function addProduct(req, res) {
  const { name, description, price, category, reviews } = req.body;
  try {
    const image_url = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    const newProduct = new Product({
      name,
      description,
      reviews,
      category,
      price,
      image: image_url,
    });
    await newProduct.save();
    return res.status(200).json({ message: "Product created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function updateProduct(req, res) {
  const { name, description, price, category, reviews } = req.body;
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "product not found!" });

    // Check if a new file was uploaded
    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "../uploads",
        path.basename(product.image)
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        // fs.rmSync(imagePath, { recursive: true });
      } else {
        console.log("image not found");
      }

      const image_url = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : product.image;
      product.image = image_url;
      product.name = name;
      product.description = description;
      product.price = price;
      product.category = category;
      product.reviews = reviews;
      await product.save();
      return res.status(200).json({ message: "Product updated successfully" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function deleteProduct(req, res) {
  const id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({ message: "product not found!" });
    if (product.image) {
      deleteImage(product.image);
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}
