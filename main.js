// --- 1. STARTUP ---
window.onload = () => {
    renderTasks();
    updateStats();
    setTimeout(checkOverdueNotifications, 2000);
};

// --- 2. CORE TASK LOGIC ---
const addBtn = document.getElementById('add-btn');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const priorityInput = document.getElementById('priority-input');

addBtn.addEventListener('click', () => {
    if (!taskInput.value) return;
    const tasks = JSON.parse(localStorage.getItem('ProTask_v1')) || [];
    tasks.push({ 
        text: taskInput.value, id: Date.now(), status: 'pending', 
        priority: priorityInput.value, dueDate: dateInput.value 
    });
    localStorage.setItem('ProTask_v1', JSON.stringify(tasks));
    taskInput.value = ""; dateInput.value = "";
    renderTasks(); updateStats();
});

function renderTasks() {
    const container = document.getElementById('task-container');
    const tasks = JSON.parse(localStorage.getItem('ProTask_v1')) || [];
    container.innerHTML = ""; 
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach(task => {
        const isOverdue = task.dueDate && task.dueDate < today && task.status === 'pending';
        const div = document.createElement('div');
        div.className = `task-card ${task.status} ${task.priority} ${isOverdue ? 'overdue' : ''}`;
        div.innerHTML = `
            <div onclick="toggleStatus(${task.id})" style="flex:1; cursor:pointer;">
                <div style="font-weight:bold;">${task.status === 'completed' ? '<s>'+task.text+'</s>' : task.text}</div>
                <small>Due: ${task.dueDate || 'No date'}</small>
                ${isOverdue ? '<br><small style="color:#e74c3c; font-weight:bold;">⚠️ OVERDUE</small>' : ''}
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        container.appendChild(div);
    });
}

window.toggleStatus = (id) => {
    let tasks = JSON.parse(localStorage.getItem('ProTask_v1'));
    tasks = tasks.map(t => t.id === id ? {...t, status: t.status === 'pending' ? 'completed' : 'pending'} : t);
    localStorage.setItem('ProTask_v1', JSON.stringify(tasks));
    renderTasks(); updateStats();
};

window.deleteTask = (id) => {
    let tasks = JSON.parse(localStorage.getItem('ProTask_v1')).filter(t => t.id !== id);
    localStorage.setItem('ProTask_v1', JSON.stringify(tasks));
    renderTasks(); updateStats();
};

// --- 3. NAVIGATION & SEARCH ---
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.task-card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? 'flex' : 'none';
    });
});

const menuItems = document.querySelectorAll('.sidebar li');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(li => li.classList.remove('active'));
        item.classList.add('active');
        const page = item.innerText.trim();
        if (page === "Analytics") {
            document.getElementById('dashboard-view').style.display = 'none';
            document.getElementById('analytics-page').style.display = 'block';
            calculateAnalytics();
        } else if (page === "Dashboard") {
            document.getElementById('dashboard-view').style.display = 'block';
            document.getElementById('analytics-page').style.display = 'none';
        } else if (page === "Settings") {
            const name = prompt("Enter Name:");
            if(name) document.querySelector('h1').innerText = `Welcome Back, ${name}`;
        }
    });
});

// --- 4. ANALYTICS & STATS ---
function calculateAnalytics() {
    const tasks = JSON.parse(localStorage.getItem('ProTask_v1')) || [];
    const done = tasks.filter(t => t.status === 'completed').length;
    const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
    document.getElementById('efficiency-rate').innerText = percent + "%";
    document.getElementById('progress-fill').style.width = percent + "%";
}

function updateStats() {
    const tasks = JSON.parse(localStorage.getItem('ProTask_v1')) || [];
    document.getElementById('pending-count').innerText = tasks.filter(t => t.status === 'pending').length;
    document.getElementById('done-count').innerText = tasks.filter(t => t.status === 'completed').length;
}

// --- 5. POMODORO TIMER ---
let timer;
let timeLeft = 25 * 60;
let isRunning = false;
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');

startTimerBtn.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timer);
        startTimerBtn.innerText = "Start";
        startTimerBtn.style.background = "#27ae60";
    } else {
        startTimerBtn.innerText = "Pause";
        startTimerBtn.style.background = "#f39c12";
        timer = setInterval(() => {
            timeLeft--;
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Time is up!");
                timeLeft = 25 * 60;
            }
        }, 1000);
    }
    isRunning = !isRunning;
});

document.getElementById('reset-timer').onclick = () => {
    clearInterval(timer); isRunning = false; timeLeft = 25 * 60;
    timerDisplay.innerText = "25:00"; startTimerBtn.innerText = "Start";
    startTimerBtn.style.background = "#27ae60";
};

// --- 6. NOTIFICATIONS ---
document.getElementById('enable-notifications').onclick = () => {
    Notification.requestPermission().then(p => { if(p === "granted") alert("Alerts On!"); });
};

function checkOverdueNotifications() {
    if (Notification.permission !== "granted") return;
    const tasks = JSON.parse(localStorage.getItem('ProTask_v1')) || [];
    const today = new Date().toISOString().split('T')[0];
    tasks.forEach(task => {
        if (task.dueDate && task.dueDate < today && task.status === 'pending') {
            new Notification("Overdue Task", { body: task.text });
        }
    });
}

document.getElementById('clear-all-btn').onclick = () => {
    if(confirm("Clear?")) { localStorage.removeItem('ProTask_v1'); renderTasks(); updateStats(); }
};
