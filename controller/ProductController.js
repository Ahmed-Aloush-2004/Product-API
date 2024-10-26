import Product from "../model/Product.js";
import { deleteImage } from "../utils/deleteImage.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Recreate `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// export async function getProducts(req, res) {
//   try {
//     let products;
//     let skipPages = 0;
//     const { filterType } = req.query;
//     const { pageNumber, category, brand, search, price, pageSize } = req.query;
// console.log(pageNumber, pageSize,brand,search,price,category);
//     console.log("this is the filterType", filterType); // Log the filterType
//     if (pageNumber && pageSize) {
//       skipPages = (parseInt(pageNumber) - 1) * parseInt(pageSize);
//     }
//     if (!filterType == "products") {
//       products = await Product.find().populate("category").populate("brand");
//       if (filterType === "offers") {
//         products = await Product.find({
//           $expr: { $gt: ["$oldPrice", "$newPrice"] }, // $expr allows using MongoDB expressions for comparison
//         })
//           .populate("category")
//           .populate("brand");
//       }

//       if (filterType === "TheMostSelling") {
//         products = await Product.find({
//           reviews: { $gte: 4, $lte: 5 }, // reviews between 4 and 5 (inclusive)
//         })
//           .populate("category")
//           .populate("brand");

//         console.log(
//           "this is the final result of products for TheMostSelling",
//           products
//         );

//         // $and: [
//         //   { reviews: { $gt: 4 } }, // reviews greater than 0
//         //   { reviews: { $lt: 5 } }, // reviews less than 5
//         // ],
//         // .sort({ newPrice: 1 })
//       }
//       if (filterType === " TheNewest") {
//         products = products
//           .sort({ createdAt: -1 }) // Sort by creation date in descending order (newest first)
//           .limit(10); // Limit the result to 10 products
//         // .populate("category")
//         // .populate("brand");

//         console.log(
//           "this is the final result of products for TheMostSelling",
//           products
//         );
//       }
//     } else {
//       const filter = {};
//       if (category !== null) {
//         filter.category = category;
//       }
//       if (brand !== null) {
//         filter.brand = brand;
//       }
//       if (search && search == "") {
//         filter.name = { $regex: search, $options: "i" };
//       }
//       if (price) {
//         const [low, high] = price.split(",");
//         filter.newPrice = { $gte: parseFloat(low), $lte: parseFloat(high) };
//       }
//       console.log(filter,"This is filter from query products");


//       products = await Product.find(filter)
//         .skip(skipPages)
//         .limit(parseInt(pageSize))
//         .populate("category")
//         .populate("brand");
//     }

//     return res.status(200).json(products);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: error.message || "Internal Server Error" });
//   }
// }

export async function getProducts(req, res) {
  try {
    let products;
    let skipPages = 0;
    const { filterType, pageNumber, category, brand, search, price, pageSize } = req.query;

    // Calculate skip pages for pagination
    if (pageNumber && pageSize) {
      skipPages = (parseInt(pageNumber) - 1) * parseInt(pageSize);
    }
    const totalDocuments = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);
    // Handle different filter types
    if (filterType !== "products") {
      if (filterType === "offers") {
        products = await Product.find({
          $expr: { $gt: ["$oldPrice", "$newPrice"] },
        })
        .populate("category")
        .populate("brand");
      } else if (filterType === "TheMostSelling") {
        products = await Product.find({
          reviews: { $gte: 4, $lte: 5 },
        })
        .populate("category")
        .populate("brand");
      } else if (filterType === "TheNewest") {
        products = await Product.find({})
          .sort({ createdAt: -1 }) // Sort by newest
          .limit(10)
          .populate("category")
          .populate("brand");
      }
    } else {
      // Basic filtering with pagination
      const filter = {};
      if (category) filter.category = category;
      if (brand) filter.brand = brand;
      if (search) filter.name = { $regex: search, $options: "i" };
      if (price) {
        const [low, high] = price.split(",");
        filter.newPrice = { $gte: parseFloat(low), $lte: parseFloat(high) };
      }

      products = await Product.find(filter)
        .skip(skipPages)
        .limit(parseInt(pageSize))
        .populate("category")
        .populate("brand");
    }

    return res.status(200).json({products,totalPages});
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
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
  const { name, description, newPrice, category, reviews, brand } = req.body;
  try {
    const image_url = `${req.protocol}://${req.get("host")}/uploads/${
      req.imageFolder
    }/${req.file.filename}`;
    const newProduct = new Product({
      name,
      description,
      reviews,
      category,
      newPrice,
      brand,
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
  const { name, description, category, reviews, brand, newPrice } = req.body;
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "product not found!" });

    if (req.file) {
      deleteImage(product.image);
      const image_url = `${req.protocol}://${req.get("host")}/uploads/${
        req.imageFolder
      }/${req.file.filename}`;

      const updatedProduct = await Product.findByIdAndUpdate(productId, {
        image: image_url,
        name,
        description,
        newPrice,
        category,
        reviews,
        brand,
      });

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
