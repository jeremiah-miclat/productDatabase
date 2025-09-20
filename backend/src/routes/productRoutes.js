import express from "express";
import {
  getProductsByDatabase,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Get all products for a database: /products?database=databaseId
router.get("/", getProductsByDatabase);

// Get a single product
router.get("/:id", getProductById);

// Create a product
router.post("/", createProduct);

// Update a product
router.put("/:id", updateProduct);

// Delete a product
router.delete("/:id", deleteProduct);

export default router;
