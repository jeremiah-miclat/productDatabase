import Product from "../models/Product.js";
import Database from "../models/Database.js";

// Get all products for a specific database
export const getProductsByDatabase = async (req, res) => {
  try {
    const { database } = req.query;
    if (!database) return res.status(400).json({ message: "Database ID required" });

    const products = await Product.find({ database });
    res.json(products);
  } catch (error) {
    console.error("getProductsByDatabase error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("database");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("getProductById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { database: databaseId, data } = req.body;

    // Validate database exists
    const database = await Database.findById(databaseId);
    if (!database) return res.status(404).json({ message: "Database not found" });

    const product = new Product({ database: databaseId, data });
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error("createProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const product = await Product.findByIdAndUpdate(id, { data }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("updateProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("deleteProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
