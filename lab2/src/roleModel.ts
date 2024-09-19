import mongoose, { Document, Schema } from "mongoose";

export interface IRole extends Document {
  value: string;
}

const roleSchema: Schema = new mongoose.Schema({
  value: { type: String, required: true, unique: true },
});

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;
