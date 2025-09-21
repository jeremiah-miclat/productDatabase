import Database from "../models/Database.js";
import UserSchema from "../models/UserSchema.js";
import Product from "../models/Product.js";

// ✅ Get all databases
export async function getAllDatabases(req, res) {
  try {
    const dbs = await Database.find()
      .populate("schema", "schemaName") // populate schemaName from schema
      .sort({ createdAt: -1 }); // sort by newest first

    res.status(200).json(dbs);
  } catch (error) {
    console.error("getAllDatabases error:", error);
    res.status(500).json({ message: "server error" });
  }
}


export async function getDatabases(req, res) {
  try {
    const databases = await Database.find().populate("schema", "schemaName"); 
    // Only bring schemaName, not the full schema document
    res.status(200).json(databases);
  } catch (error) {
    console.error("getDatabases error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ Get single database
export const getDatabaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await Database.findById(id).populate("schema"); 

    if (!db) {
      return res.status(404).json({ message: "Database not found" });
    }

    // fetch products linked to this database
    const products = await Product.find({ "database.id": id });

    res.json({
      ...db.toObject(),
      products, // 👈 attach products array here
    });
  } catch (error) {
    console.error("getDatabaseById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Create new database
export async function createDatabase(req, res) {
  try {
    const { name, description, schema } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!schema) return res.status(400).json({ message: "Schema is required" });

    const existing = await Database.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Database name already exists" });

    // Optional: validate that schema ID exists
    const schemaExists = await UserSchema.findById(schema);
    if (!schemaExists)
      return res.status(400).json({ message: "Schema not found" });

    const newDB = new Database({ name, description, schema });
    const saved = await newDB.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error("createDatabase error:", error);
    res.status(500).json({ message: "Server error" });
  }
}


// Update database (flexible, matches frontend)

export async function updateDatabase(req, res) {
  try {
    const { name, description, schema } = req.body;

    // Check if this database already has products
    const hasProducts =
      (await Product.findOne({ database: req.params.id })) ||
      (await Product.findOne({ "database.id": req.params.id }));

    if (hasProducts && (name || schema)) {
      return res.status(400).json({
        message: "Cannot update name or schema because database has linked products",
      });
    }

    // Build update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (schema) {
      // optional: validate schema ID
      const schemaExists = await UserSchema.findById(schema);
      if (!schemaExists) {
        return res.status(400).json({ message: "Schema not found" });
      }
      updateData.schema = schema;
    }

    const updated = await Database.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Database not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("updateDatabase error:", error);
    res.status(500).json({ message: "Server error" });
  }
}




// ✅ Delete database
export async function deleteDatabase(req, res) {
  try {
    const { id } = req.params;

    // ✅ Fix: check embedded field
    const hasProducts = await Product.findOne({ "database.id": id });
    if (hasProducts) {
      return res.status(400).json({
        message: "Cannot delete database because it has linked products",
      });
    }

    const deleted = await Database.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Database not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("deleteDatabase error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
