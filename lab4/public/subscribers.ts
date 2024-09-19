interface Subscriber {
  _id: string;
  name: string;
  address: string;
  email: string;
}

document.addEventListener("DOMContentLoaded", () => {
  const fetchSubscribers = async (): Promise<void> => {
    try {
      const response = await fetch("/api/subscribers");
      const subscribers: Subscriber[] = await response.json();
      displaySubscribers(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };

  const displaySubscribers = (subscribers: Subscriber[]): void => {
    const list = document.getElementById(
      "subscribers-list"
    ) as HTMLUListElement;
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

      const editBtn = li.querySelector(".btn-edit") as HTMLButtonElement;
      const deleteBtn = li.querySelector(".btn-delete") as HTMLButtonElement;

      editBtn.addEventListener("click", () => openEditModal(subscriber));
      deleteBtn.addEventListener("click", () =>
        deleteSubscriber(subscriber._id)
      );
    });
  };

  const openEditModal = (subscriber: Subscriber): void => {
    const editName = document.getElementById("edit-name") as HTMLInputElement;
    const editAddress = document.getElementById(
      "edit-address"
    ) as HTMLInputElement;
    const editEmail = document.getElementById("edit-email") as HTMLInputElement;
    const editPassword = document.getElementById(
      "edit-password"
    ) as HTMLInputElement;

    // Заповнюємо поля форми редагування
    editName.value = subscriber.name;
    editAddress.value = subscriber.address;
    editEmail.value = subscriber.email;

    const editForm = document.getElementById(
      "edit-subscriber-form"
    ) as HTMLFormElement;
    const modal = new bootstrap.Modal(
      document.getElementById("editSubscriberModal")!
    );

    editForm.onsubmit = async (event: Event) => {
      event.preventDefault();
      try {
        await fetch(`/api/subscribers/${subscriber._id}`, {
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
      } catch (error) {
        console.error("Error updating subscriber:", error);
      }
    };

    modal.show();
  };

  const deleteSubscriber = async (id: string): Promise<void> => {
    try {
      await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
      fetchSubscribers();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    }
  };

  const form = document.getElementById("subscriber-form") as HTMLFormElement;
  form.addEventListener("submit", async (event: Event) => {
    console.log(1);
    event.preventDefault();
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const address = (document.getElementById("address") as HTMLInputElement)
      .value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    try {
      await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, address, email, password }),
      });
      form.reset();
      fetchSubscribers();
    } catch (error) {
      console.error("Error adding subscriber:", error);
    }
  });

  fetchSubscribers();
});
