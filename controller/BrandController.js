import Brand from "../model/Brand.js";
import { deleteImage } from "../utils/deleteImage.js";

export async function getBrands(req, res) {
  try {
    const brands = await Brand.find();

    return res.status(200).json(brands);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}
export async function getBrandById(req, res) {
  const brandId = req.params.id;

  try {
    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(404).json({ message: "category not found!" });
    return res.status(200).json({ brand });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function addBrand(req, res) {
  const { name } = req.body;

  try {
    const trimmedName = name.trim().toLowerCase();
    // Search for an existing category with an exact match, case insensitive
    const existBrand = await Brand.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" }, // `^` and `$` ensure exact match, 'i' makes it case-insensitive
    });

    if (existBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const image_url = `${req.protocol}://${req.get("host")}/uploads/${
      req.imageFolder
    }/${req.file.filename}`;

    const newCategory = new Brand({ name, image_url });

    await newCategory.save();

    return res.status(200).json({ message: "Brand created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function deleteBrandById(req, res) {
  const id = req.params.id;

  try {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) return res.status(404).json({ message: "brand not found!" });

    deleteImage(brand.image_url);

    return res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}
