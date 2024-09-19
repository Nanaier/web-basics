"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderNewslettersPage = exports.renderSubscribersPage = exports.renderHomePage = void 0;
// Головна сторінка
const renderHomePage = (req, res) => {
    res.sendFile("index.html", { root: "public" });
};
exports.renderHomePage = renderHomePage;
// Сторінка підписників
const renderSubscribersPage = (req, res) => {
    res.sendFile("subscribers.html", { root: "public" });
};
exports.renderSubscribersPage = renderSubscribersPage;
// Сторінка розсилок
const renderNewslettersPage = (req, res) => {
    res.sendFile("newsletters.html", { root: "public" });
};
exports.renderNewslettersPage = renderNewslettersPage;
