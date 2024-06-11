window.addEventListener("load", () => {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  for (const button of deleteButtons) {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      button.parentNode.remove();

      const response = await fetch(`/notes/delete/${id}`, {
        method: "DELETE",
      });
    });
  }

  const editButtons = document.querySelectorAll(".edit-btn");
  for (const button of editButtons) {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      const text = button.parentNode.querySelector(".text").innerHTML;

      const response = await fetch(`/notes/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
    });
  }
});
