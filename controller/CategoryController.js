import Category from "../model/Category.js";

export async function getCategories(req, res) {
  try {
    const categories = await Category.find();

    return res.status(200).json({ data: categories });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}
export async function getCategoryById(req, res) {
  const categoryId = req.params.id;

  try {
    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "category not found!" });
    return res.status(200).json({ data: category });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function addCategory(req, res) {
  const { name } = req.body;

  try {
    const trimmedName = name.trim().toLowerCase();
    // Search for an existing category with an exact match, case insensitive
    const existCategory = await Category.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" }, // `^` and `$` ensure exact match, 'i' makes it case-insensitive
    });

    if (existCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name });

    await newCategory.save();

    return res.status(200).json({ message: "Category created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function deleteCategoryById(req, res) {
  const id = req.params.id;

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ message: "category not found!" });
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}
