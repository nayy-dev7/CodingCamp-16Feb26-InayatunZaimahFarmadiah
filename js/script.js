const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const todoBody = document.getElementById("todo-body");
const filterSelect = document.getElementById("filter-select");
const emptyState = document.getElementById("empty-state");

let todos = [];

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const task = todoInput.value.trim();
    const date = dateInput.value;

    if (task === "" || date === "") {
        alert("Please fill in both task and date!");
        return;
    }

    const todo = {
        id: Date.now(),
        task: task,
        date: date,
        completed: false
    };

    todos.push(todo);
    renderTodos(filterSelect.value);
    form.reset();
});

function renderTodos(filter) {
    todoBody.innerHTML = "";

    let filteredTodos = todos;

    if (filter === "active") {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (filter === "done") {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    if (filter === "today") {
        const today = new Date().toISOString().split("T")[0];
        filteredTodos = todos.filter(todo => todo.date === today);
    }

    if (filteredTodos.length === 0) {
        emptyState.style.display = "block";
        return;
    } else {
        emptyState.style.display = "none";
    }

    filteredTodos.forEach(todo => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${todo.task}</td>
            <td>${todo.date}</td>
            <td>
                <input type="checkbox" ${todo.completed ? "checked" : ""}>
                <span class="${todo.completed ? "status-done" : "status-active"}">
                    ${todo.completed ? "Done" : "Active"}
                </span>
            </td>
            <td>
                <span class="action-btn edit-btn">✏️</span>
                <span class="action-btn delete-btn">🗑️</span>
            </td>
        `;

        // Toggle status
        row.querySelector("input").addEventListener("change", function() {
            todo.completed = !todo.completed;
            renderTodos(filterSelect.value);
        });

        // Delete
        row.querySelector(".delete-btn").addEventListener("click", function() {
            todos = todos.filter(t => t.id !== todo.id);
            renderTodos(filterSelect.value);
        });

        // Edit
        row.querySelector(".edit-btn").addEventListener("click", function() {
            const newTask = prompt("Edit task:", todo.task);
            if (newTask !== null && newTask.trim() !== "") {
                todo.task = newTask.trim();
                renderTodos(filterSelect.value);
            }
        });

        todoBody.appendChild(row);
    });
}

filterSelect.addEventListener("change", function() {
    renderTodos(this.value);
});