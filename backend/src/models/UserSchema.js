import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  schemaName: { type: String, required: true, unique: true },
  fields: { type: Object, required: true },
},{timestamps:true});

export default mongoose.model("UserSchema", UserSchema);