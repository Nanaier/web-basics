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
    const fetchNewsletters = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch("/api/newsletters");
            const newsletters = yield response.json();
            displayNewsletters(newsletters);
        }
        catch (error) {
            console.error("Error fetching newsletters:", error);
        }
    });
    const displayNewsletters = (newsletters) => {
        const list = document.getElementById("newsletters-list");
        list.innerHTML = "";
        newsletters.forEach((newsletter) => {
            const li = document.createElement("li");
            li.textContent = `${newsletter.subject} (${newsletter.sendDate}) - Subscriber: ${newsletter.subscriber.email}`;
            li.classList.add("list-group-item");
            list.appendChild(li);
        });
    };
    const form = document.getElementById("newsletter-form");
    form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const subject = document.getElementById("subject")
            .value;
        const content = document.getElementById("content")
            .value;
        const sendDate = document.getElementById("sendDate")
            .value;
        const subscriberEmail = document.getElementById("subscriberEmail").value;
        try {
            const response = yield fetch("/api/newsletters", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subject, content, sendDate, subscriberEmail }),
            });
            if (response.ok) {
                fetchNewsletters();
            }
        }
        catch (error) {
            console.error("Error adding newsletter:", error);
        }
    }));
    fetchNewsletters();
});
