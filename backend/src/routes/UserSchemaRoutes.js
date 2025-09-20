// routes/userSchemaRoutes.js
import express from "express";
import {
  getAllSchemas,
  getSchemaById,
  createSchema,
  updateSchema,
  deleteSchema
} from "../controllers/schemasController.js";

const router = express.Router();

// GET all schemas
router.get("/", getAllSchemas);

// GET schema by ID
router.get("/:id", getSchemaById);

// CREATE schema
router.post("/", createSchema);

// UPDATE schema
router.put("/:id", updateSchema);

// DELETE schema
router.delete("/:id", deleteSchema);

export default router;
