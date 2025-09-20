import express from "express";
import {
  getAllDatabases,
  getDatabaseById,
  createDatabase,
  updateDatabase,
  deleteDatabase,
} from "../controllers/dataBaseController.js";

const router = express.Router();

// /api/databases
router.get("/", getAllDatabases);
router.get("/:id", getDatabaseById);
router.post("/", createDatabase);
router.put("/:id", updateDatabase);
router.delete("/:id", deleteDatabase);

export default router;
