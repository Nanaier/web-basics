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
            return yield response.json();
        }
        catch (error) {
            console.error("Error fetching subscribers:", error);
            return [];
        }
    });
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
            li.classList.add("list-group-item");
            li.innerHTML = `
        <h5>${newsletter.subject} - ${newsletter.subscriber.email}</h5>
        <p>${newsletter.content}</p>
        <small>Sent on: ${new Date(newsletter.sendDate).toLocaleDateString()}</small>
        <div class="mt-2">
          <button class="btn btn-sm btn-warning btn-edit" data-id="${newsletter._id}">Edit</button>
          <button class="btn btn-sm btn-danger btn-delete" data-id="${newsletter._id}">Delete</button>
        </div>
      `;
            list.appendChild(li);
            const editBtn = li.querySelector(".btn-edit");
            const deleteBtn = li.querySelector(".btn-delete");
            editBtn.addEventListener("click", () => openEditModal(newsletter));
            deleteBtn.addEventListener("click", () => deleteNewsletter(newsletter._id));
        });
    };
    const openEditModal = (newsletter) => {
        console.log(newsletter);
        const editSubject = document.getElementById("edit-subject");
        const editContent = document.getElementById("edit-content");
        const editSubscriberEmail = document.getElementById("edit-subscriberEmail");
        const editSendDate = document.getElementById("edit-sendDate");
        // Populate the edit form with newsletter details
        editSubject.value = newsletter.subject;
        editContent.value = newsletter.content;
        editSendDate.valueAsDate = new Date(newsletter.sendDate);
        editSubscriberEmail.value = newsletter.subscriber.email;
        const editForm = document.getElementById("edit-newsletter-form");
        const modal = new bootstrap.Modal(document.getElementById("editNewsletterModal"));
        editForm.onsubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            try {
                yield fetch(`/api/newsletters/${newsletter._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        subject: editSubject.value,
                        content: editContent.value,
                        sendDate: editSendDate.value,
                    }),
                });
                modal.hide();
                fetchNewsletters();
            }
            catch (error) {
                console.error("Error updating newsletter:", error);
            }
        });
        modal.show();
    };
    const deleteNewsletter = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fetch(`/api/newsletters/${id}`, { method: "DELETE" });
            fetchNewsletters();
        }
        catch (error) {
            console.error("Error deleting newsletter:", error);
        }
    });
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
            yield fetch("/api/newsletters", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subject,
                    content,
                    sendDate,
                    subscriberEmail: subscriberEmail,
                }),
            });
            form.reset();
            fetchNewsletters();
        }
        catch (error) {
            console.error("Error adding newsletter:", error);
        }
    }));
    // Autocomplete for Subscriber Emails
    const setupAutocomplete = () => __awaiter(void 0, void 0, void 0, function* () {
        const subscribers = yield fetchSubscribers();
        const emailList = subscribers.map((sub) => sub.email);
        $("#subscriberEmail").autocomplete({
            source: emailList,
        });
    });
    setupAutocomplete();
    fetchNewsletters();
});
