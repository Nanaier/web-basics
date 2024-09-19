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
const newsletterModel_1 = __importDefault(require("../models/newsletterModel"));
const subscriberModel_1 = __importDefault(require("../models/subscriberModel"));
const router = (0, express_1.Router)();
// Додати нову розсилку
router.post("/newsletters", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subject, content, sendDate, subscriberEmail } = req.body;
    try {
        // Знайдіть підписника по email
        const subscriber = yield subscriberModel_1.default.findOne({ email: subscriberEmail });
        if (!subscriber) {
            return res.status(404).json({ error: "Subscriber not found" });
        }
        // Створіть розсилку для цього підписника
        const newsletter = new newsletterModel_1.default({
            subject,
            content,
            sendDate,
            subscriber: subscriber._id,
        });
        yield newsletter.save();
        // Можливо, додати цю розсилку до списку розсилок підписника
        subscriber.newsletters.push(newsletter._id);
        yield subscriber.save();
        res.status(201).json(newsletter);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// Отримати всі розсилки
router.get("/newsletters", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsletters = yield newsletterModel_1.default.find().populate({
            path: "subscriber",
            select: "email",
        });
        res.json(newsletters);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// Отримати всіх підписників
router.get("/newsletters/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const newsletter = yield newsletterModel_1.default.findById(id);
        res.json(newsletter);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// Оновити розсилку
router.put("/newsletters/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { subject, content, sendDate } = req.body;
    try {
        const newsletter = yield newsletterModel_1.default.findByIdAndUpdate(id, { subject, content, sendDate }, { new: true });
        res.json(newsletter);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// Видалити розсилку
router.delete("/newsletters/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield newsletterModel_1.default.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
