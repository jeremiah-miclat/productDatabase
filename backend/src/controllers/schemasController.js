// controllers/userSchemaController.js
import UserSchema from "../models/UserSchema.js";
import Database from "../models/Database.js";



// Get all user schemas
export async function getAllSchemas(req, res) {
  try {
    const schemas = await UserSchema.find().sort({ createdAt: -1 });
    res.status(200).json(schemas);
  } catch (error) {
    console.error("Server error in getAllSchemas:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get schema by ID
export async function getSchemaById(req, res) {
  try {
    const schema = await UserSchema.findById(req.params.id);
    if (!schema) return res.status(404).json({ message: "Schema not found" });
    res.status(200).json(schema);
  } catch (error) {
    console.error("Server error in getSchemaById:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Create schema
export async function createSchema(req, res) {
  try {
    const { schemaName, fields } = req.body;

    // Validation
    if (!schemaName || !fields) {
      return res.status(400).json({ message: "schemaName and fields are required" });
    }

    const newSchema = new UserSchema({ schemaName, fields });
    const savedSchema = await newSchema.save();

    res.status(201).json(savedSchema);
  } catch (error) {
    console.error("Server error in createSchema:", error);

    if (error.code === 11000) {
      // duplicate key error for schemaName
      return res.status(400).json({ message: "Schema name must be unique" });
    }

    res.status(500).json({ message: "Server error" });
  }
}

// Update schema
export async function updateSchema(req, res) {
  try {
    const { schemaName, fields } = req.body;

    const updatedSchema = await UserSchema.findByIdAndUpdate(
      req.params.id,
      { schemaName, fields },
      { new: true, runValidators: true }
    );

    if (!updatedSchema) {
      return res.status(404).json({ message: "Schema not found" });
    }

    res.status(200).json(updatedSchema);
  } catch (error) {
    console.error("Server error in updateSchema:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ Delete schema
export async function deleteSchema(req, res) {
  try {
    const { id } = req.params;

    // Check if schema is being used in any database
    const inUse = await Database.findOne({ schema: id });
    if (inUse) {
      return res.status(400).json({
        message: "Schema cannot be deleted because it is in use by a database",
      });
    }

    const deleted = await UserSchema.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Schema not found" });
    }

    res.status(200).json({ message: "Schema deleted successfully" });
  } catch (error) {
    console.error("deleteSchema error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
