"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./db"));
const newslettersRoutes_1 = __importDefault(require("./routes/newslettersRoutes"));
const subscribersRoutes_1 = __importDefault(require("./routes/subscribersRoutes"));
const path_1 = __importDefault(require("path"));
const views_1 = require("./views");
const app = (0, express_1.default)();
const port = 3000;
(0, db_1.default)();
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.get("/", views_1.renderHomePage);
app.get("/subscribers", views_1.renderSubscribersPage);
app.get("/newsletters", views_1.renderNewslettersPage);
app.use("/api", newslettersRoutes_1.default);
app.use("/api", subscribersRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// Варіант 10. Спроектувати базу даних про список розсилки і передплатників: тема і
// зміст листа, дата відправки, імена та адреси передплатників, їх облікові записи і
// паролі.
