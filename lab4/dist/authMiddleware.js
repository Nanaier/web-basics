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
exports.adminOnly = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("./userModel"));
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield userModel_1.default.findById(decoded.id);
        console.log(user);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Not authorized, invalid token" });
    }
});
exports.authenticateToken = authenticateToken;
const adminOnly = (req, res, next) => {
    var _a, _b;
    console.log((_a = req.user) === null || _a === void 0 ? void 0 : _a.role);
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "ADMIN") {
        res.status(403).json({ message: "Admin access only" });
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
