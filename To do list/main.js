const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');

// THE 50 HUMAN HABITS
const humanHabits = [
    "Wake up", "Stretch body", "Drink water", "Wash face", "Brush teeth",
    "Deep breath", "Meditate", "Smile", "Exercise", "Shower",
    "Get dressed", "Eat breakfast", "Read news", "Think positive", "Plan goals",
    "Start work", "Learn skill", "Go walking", "Talk to people", "Listen well",
    "Help others", "Laugh out loud", "Rest eyes", "Healthy snack", "Write notes",
    "Clean room", "Organize desk", "Reflect", "Create art", "Explore",
    "Phone call", "Self care", "Cook meal", "Eat lunch", "Stay hydrated",
    "Stay focused", "Solve problems", "Play games", "Sing songs", "Dance",
    "Go outside", "Observe nature", "See the sky", "Short nap", "Stretch legs",
    "Eat dinner", "Review day", "Read book", "Deep sleep", "Dream"
];

function render() {
    taskList.innerHTML = '';
    humanHabits.forEach((habit, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${index + 1}. ${habit}</span>`;
        taskList.appendChild(li);
    });
}

addButton.addEventListener('click', () => {
    if (taskInput.value.trim() !== "") {
        humanHabits.unshift(taskInput.value.trim());
        taskInput.value = "";
        render();
    }
});

render();
