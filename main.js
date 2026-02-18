let count = 0;
const display = document.getElementById('counter-display');
const title = document.getElementById('main-title');

// 1. PERSISTENCE: Load from Firebase on start
if (window.dbOnValue) {
    const starCountRef = window.dbRef(window.database, 'stats/counter');
    window.dbOnValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
            count = data;
            updateDisplay();
        }
    });
}

function updateDisplay() {
    display.innerText = count;
    // Gold Glow logic
    if (count >= 10) {
        display.classList.add('gold-glow');
        title.classList.add('gold-glow');
    } else {
        display.classList.remove('gold-glow');
        title.classList.remove('gold-glow');
    }
}

// 2. ANIMATION: Increase size while tapping
const incrementBtn = document.getElementById('increment-btn');

const startGrow = () => {
    display.style.transform = "scale(1.5)"; // Grow size
    display.style.transition = "transform 0.1s ease-out";
};

const stopGrow = () => {
    display.style.transform = "scale(1)"; // Back to normal
};

// Event Listeners for Counter & Animation
incrementBtn.addEventListener('mousedown', () => {
    count++;
    updateDisplay();
    startGrow();
    saveToCloud();
});

incrementBtn.addEventListener('mouseup', stopGrow);
incrementBtn.addEventListener('mouseleave', stopGrow);

// Mobile Touch Support for scaling
incrementBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    count++;
    updateDisplay();
    startGrow();
    saveToCloud();
});
incrementBtn.addEventListener('touchend', stopGrow);

// Standard buttons
document.getElementById('decrement-btn').addEventListener('click', () => {
    if (count > 0) count--;
    updateDisplay();
    saveToCloud();
});

document.getElementById('reset-btn').addEventListener('click', () => {
    count = 0;
    updateDisplay();
    saveToCloud();
});

function saveToCloud() {
    if (window.database && window.dbSet) {
        window.dbSet(window.dbRef(window.database, 'stats/counter'), count);
    }
}
