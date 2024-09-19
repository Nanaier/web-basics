"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const newsletterSchema = new mongoose_1.Schema({
    subject: { type: String, required: true },
    content: { type: String, required: true },
    sendDate: { type: Date, required: true },
    subscriber: { type: mongoose_1.Types.ObjectId, ref: 'Subscriber', required: true } // Додано посилання на підписника
});
const Newsletter = (0, mongoose_1.model)("Newsletter", newsletterSchema);
exports.default = Newsletter;
