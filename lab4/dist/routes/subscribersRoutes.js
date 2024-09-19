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
const express_1 = require("express");
const subscriberModel_1 = __importDefault(require("../models/subscriberModel"));
const router = (0, express_1.Router)();
// Додати нового підписника
router.post("/subscribers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, address, password } = req.body;
    try {
        const subscriber = new subscriberModel_1.default({ name, email, address, password });
        yield subscriber.save();
        res.status(201).json(subscriber);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// Отримати всіх підписників
router.get("/subscribers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribers = yield subscriberModel_1.default.find();
        res.json(subscribers);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// Отримати всіх підписників
router.get("/subscribers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const subscriber = yield subscriberModel_1.default.findById(id);
        res.json(subscriber);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// Оновити підписника
router.put("/subscribers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, address, password } = req.body;
    try {
        const subscriber = yield subscriberModel_1.default.findByIdAndUpdate(id, { name, email, address, password }, { new: true });
        res.json(subscriber);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// Видалити підписника
router.delete("/subscribers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield subscriberModel_1.default.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
