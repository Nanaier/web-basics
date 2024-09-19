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
const mongoose_1 = require("mongoose");
const newsletterModel_1 = __importDefault(require("./newsletterModel"));
const subscriberSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    newsletters: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Newsletter" }], // Можна зберігати посилання на всі листи розсилки
});
subscriberSchema.pre("deleteOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subscriberId = this.getFilter()["_id"];
            yield newsletterModel_1.default.deleteMany({ subscriber: subscriberId });
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
const Subscriber = (0, mongoose_1.model)("Subscriber", subscriberSchema);
exports.default = Subscriber;
