import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

import { IRole } from "./roleModel";

export interface IUser extends Document {
  username: string;
  password: string;
  role: IRole["_id"] | IRole;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema: Schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  },
  { timestamps: true }
);

// Хешування паролю перед збереженням
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Перевірка паролю
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
