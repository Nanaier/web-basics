"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.loginUser = exports.registerUser = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("./userModel"));
const roleModel_1 = __importDefault(require("./roleModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find().populate("role", "value");
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error });
    }
});
exports.getAllUsers = getAllUsers;
// Реєстрація користувача
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const userExists = yield userModel_1.default.findOne({ username });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Знайти роль за назвою
        const role = yield roleModel_1.default.findOne({ value: "USER" });
        if (!role) {
            res.status(400).json({ message: "Role not found" });
            return;
        }
        const user = new userModel_1.default({ username, password, role: role._id });
        yield user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
});
exports.registerUser = registerUser;
// Логін користувача
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // Завантажуємо користувача разом з його роллю
        const user = yield userModel_1.default.findOne({ username }).populate("role");
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        // Перевіряємо, що роль була завантажена, і явно приводимо до типу IRole
        const userRole = user.role.value;
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: userRole }, // Передаємо назву ролі в токен
        process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
});
exports.loginUser = loginUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { currentPassword, newPassword } = req.body;
    try {
        // Завантажуємо користувача з req.user, який був доданий в authenticateToken
        const user = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Перевіряємо, чи збігається поточний пароль
        const isMatch = yield user.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(400).json({ message: "Current password is incorrect" });
            return;
        }
        user.password = newPassword;
        yield user.save();
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Password change failed", error });
    }
});
exports.changePassword = changePassword;
