import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    database: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Database", required: true },
      name: { type: String, required: true },
    },
    userSchema: { // changed from 'schema' to 'userSchema'
      id: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" },
      name: { type: String },
    },
    data: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
