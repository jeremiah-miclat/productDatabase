import mongoose from "mongoose";

const databaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // each logical DB must have a unique name
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    schema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema", // only one schema reference allowed
      required: true, // optional until user links one
    },
  },
  { timestamps: true }
);

export default mongoose.model("Database", databaseSchema);
