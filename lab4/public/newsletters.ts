declare var $: any;

interface Subscriber {
  email: string;
}

interface Newsletter {
  _id: string;
  subject: string;
  content: string;
  sendDate: string;
  subscriber: Subscriber;
}

document.addEventListener("DOMContentLoaded", () => {
  const fetchSubscribers = async (): Promise<Subscriber[]> => {
    try {
      const response = await fetch("/api/subscribers");
      return await response.json();
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      return [];
    }
  };

  const fetchNewsletters = async (): Promise<void> => {
    try {
      const response = await fetch("/api/newsletters");
      const newsletters: Newsletter[] = await response.json();
      displayNewsletters(newsletters);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    }
  };

  const displayNewsletters = (newsletters: Newsletter[]): void => {
    const list = document.getElementById(
      "newsletters-list"
    ) as HTMLUListElement;
    list.innerHTML = "";
    newsletters.forEach((newsletter) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `
        <h5>${newsletter.subject} - ${newsletter.subscriber.email}</h5>
        <p>${newsletter.content}</p>
        <small>Sent on: ${new Date(
          newsletter.sendDate
        ).toLocaleDateString()}</small>
        <div class="mt-2">
          <button class="btn btn-sm btn-warning btn-edit" data-id="${
            newsletter._id
          }">Edit</button>
          <button class="btn btn-sm btn-danger btn-delete" data-id="${
            newsletter._id
          }">Delete</button>
        </div>
      `;
      list.appendChild(li);

      const editBtn = li.querySelector(".btn-edit") as HTMLButtonElement;
      const deleteBtn = li.querySelector(".btn-delete") as HTMLButtonElement;

      editBtn.addEventListener("click", () => openEditModal(newsletter));
      deleteBtn.addEventListener("click", () =>
        deleteNewsletter(newsletter._id)
      );
    });
  };

  const openEditModal = (newsletter: Newsletter): void => {
    console.log(newsletter);
    const editSubject = document.getElementById(
      "edit-subject"
    ) as HTMLInputElement;
    const editContent = document.getElementById(
      "edit-content"
    ) as HTMLTextAreaElement;
    const editSubscriberEmail = document.getElementById(
      "edit-subscriberEmail"
    ) as HTMLInputElement;
    const editSendDate = document.getElementById(
      "edit-sendDate"
    ) as HTMLInputElement;

    // Populate the edit form with newsletter details
    editSubject.value = newsletter.subject;
    editContent.value = newsletter.content;
    editSendDate.valueAsDate = new Date(newsletter.sendDate);
    editSubscriberEmail.value = newsletter.subscriber.email;

    const editForm = document.getElementById(
      "edit-newsletter-form"
    ) as HTMLFormElement;
    const modal = new bootstrap.Modal(
      document.getElementById("editNewsletterModal")!
    );

    editForm.onsubmit = async (event: Event) => {
      event.preventDefault();
      try {
        await fetch(`/api/newsletters/${newsletter._id}`, {
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
      } catch (error) {
        console.error("Error updating newsletter:", error);
      }
    };

    modal.show();
  };

  const deleteNewsletter = async (id: string): Promise<void> => {
    try {
      await fetch(`/api/newsletters/${id}`, { method: "DELETE" });
      fetchNewsletters();
    } catch (error) {
      console.error("Error deleting newsletter:", error);
    }
  };

  const form = document.getElementById("newsletter-form") as HTMLFormElement;
  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    const subject = (document.getElementById("subject") as HTMLInputElement)
      .value;
    const content = (document.getElementById("content") as HTMLTextAreaElement)
      .value;
    const sendDate = (document.getElementById("sendDate") as HTMLInputElement)
      .value;
    const subscriberEmail = (
      document.getElementById("subscriberEmail") as HTMLInputElement
    ).value;

    try {
      await fetch("/api/newsletters", {
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
    } catch (error) {
      console.error("Error adding newsletter:", error);
    }
  });

  // Autocomplete for Subscriber Emails
  const setupAutocomplete = async () => {
    const subscribers = await fetchSubscribers();
    const emailList = subscribers.map((sub) => sub.email);

    $("#subscriberEmail").autocomplete({
      source: emailList,
    });
  };

  setupAutocomplete();
  fetchNewsletters();
});
