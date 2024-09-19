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
            li.classList.add("list-group-item");
            li.innerHTML = `
        <span>${subscriber.name} (${subscriber.email})</span>
        <div>
          <button class="btn btn-sm btn-warning btn-edit">Edit</button>
          <button class="btn btn-sm btn-danger btn-delete">Delete</button>
        </div>
      `;
            list.appendChild(li);
            const editBtn = li.querySelector(".btn-edit");
            const deleteBtn = li.querySelector(".btn-delete");
            editBtn.addEventListener("click", () => openEditModal(subscriber));
            deleteBtn.addEventListener("click", () => deleteSubscriber(subscriber._id));
        });
    };
    const openEditModal = (subscriber) => {
        const editName = document.getElementById("edit-name");
        const editAddress = document.getElementById("edit-address");
        const editEmail = document.getElementById("edit-email");
        const editPassword = document.getElementById("edit-password");
        // Заповнюємо поля форми редагування
        editName.value = subscriber.name;
        editAddress.value = subscriber.address;
        editEmail.value = subscriber.email;
        const editForm = document.getElementById("edit-subscriber-form");
        const modal = new bootstrap.Modal(document.getElementById("editSubscriberModal"));
        editForm.onsubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            try {
                yield fetch(`/api/subscribers/${subscriber._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: editName.value,
                        address: editAddress.value,
                        email: editEmail.value,
                        password: editPassword.value,
                    }),
                });
                modal.hide();
                fetchSubscribers();
            }
            catch (error) {
                console.error("Error updating subscriber:", error);
            }
        });
        modal.show();
    };
    const deleteSubscriber = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fetch(`/api/subscribers/${id}`, { method: "DELETE" });
            fetchSubscribers();
        }
        catch (error) {
            console.error("Error deleting subscriber:", error);
        }
    });
    const form = document.getElementById("subscriber-form");
    form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(1);
        event.preventDefault();
        const name = document.getElementById("name").value;
        const address = document.getElementById("address")
            .value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password")
            .value;
        try {
            yield fetch("/api/subscribers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, address, email, password }),
            });
            form.reset();
            fetchSubscribers();
        }
        catch (error) {
            console.error("Error adding subscriber:", error);
        }
    }));
    fetchSubscribers();
});
