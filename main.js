// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Selectors
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');

// Data
let startingTasks = [
    "Learn HTML Semantics", "Master CSS Flexbox", "Understand JS Variables",
    "Connect Firebase Database", "Setup GitHub Pages", "Create Responsive Design",
    "Debug JavaScript Console", "Optimize Image Sizes", "Write Clean Code",
    "Build Portfolio Project", "Learn Git Commands", "Study UI/UX Basics",
    "Implement LocalStorage", "Test Mobile View", "Research API Integration",
    "Update CSS Variables", "Fix Navigation Menu", "Refactor Main.js",
    "Submit Client Proposal", "Deploy Live Website"
];

// Render
function renderTasks() {
    taskList.innerHTML = "";
    startingTasks.forEach((task, index) => {
        const li = document.createElement('li');
        const colorIndex = (index % 5) + 1;
        li.className = `color-${colorIndex}`;
        
        li.innerHTML = `
            <span><strong>${index + 1}.</strong> ${task}</span>
            <button class="delete-btn" onclick="removeTask(${index})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

// Global Remove
window.removeTask = (index) => {
    startingTasks.splice(index, 1);
    renderTasks();
};

// Event Listeners
addButton.addEventListener('click', () => {
    if (taskInput.value.trim() !== "") {
        startingTasks.push(taskInput.value);
        taskInput.value = "";
        renderTasks();
    }
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addButton.click();
});

renderTasks();
