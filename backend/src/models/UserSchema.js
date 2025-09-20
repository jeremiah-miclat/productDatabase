import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  schemaName: { type: String, required: true },
  fields: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
}, { timestamps: true });

export default mongoose.model("UserSchema", UserSchema);