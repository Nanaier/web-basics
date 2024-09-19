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
document.addEventListener("DOMContentLoaded", () => {
    const fetchSubscribers = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch("/api/subscribers");
            const subscribers = yield response.json();
            displaySubscribers(subscribers);
        }
        catch (error) {
            console.error("Error fetching subscribers:", error);
        }
    });
    const displaySubscribers = (subscribers) => {
        const list = document.getElementById("subscribers-list");
        list.innerHTML = "";
        subscribers.forEach((subscriber) => {
            const li = document.createElement("li");
            li.textContent = `${subscriber.name} (${subscriber.email})`;
            li.classList.add("list-group-item");
            list.appendChild(li);
        });
    };
    fetchSubscribers();
});
