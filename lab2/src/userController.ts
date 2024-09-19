import { Request, Response } from "express";
import User from "./userModel";
import Role, { IRole } from "./roleModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().populate("role", "value");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

// Реєстрація користувача
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Знайти роль за назвою
    const role = await Role.findOne({ value: "USER" });
    if (!role) {
      res.status(400).json({ message: "Role not found" });
      return;
    }

    const user = new User({ username, password, role: role._id });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// Логін користувача
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    // Завантажуємо користувача разом з його роллю
    const user = await User.findOne({ username }).populate("role");

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Перевіряємо, що роль була завантажена, і явно приводимо до типу IRole
    const userRole = (user.role as IRole).value;

    const token = jwt.sign(
      { id: user._id, role: userRole }, // Передаємо назву ролі в токен
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Завантажуємо користувача з req.user, який був доданий в authenticateToken
    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Перевіряємо, чи збігається поточний пароль
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password change failed", error });
  }
};
