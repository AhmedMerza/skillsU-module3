document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-task").forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const taskId = button.dataset.id;
      fetch(`/delete/${taskId}`, { method: "POST" })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const taskElement = document.getElementById(`task-${taskId}`);
            taskElement.classList.add("removed");
            setTimeout(() => taskElement.remove(), 500);
          }
        })
        .catch(error => console.error("Error deleting task:", error));
    });
  });

  document.querySelectorAll(".complete-task").forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const taskId = button.dataset.id;
      fetch(`/complete/${taskId}`, { method: "POST" })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
console.log(taskId);
          document.getElementById(`task-${taskId}`).querySelector('.complete-task').remove();
          }
        })
        .catch(error => console.error("Error completing task:", error));
    });
  });
});
