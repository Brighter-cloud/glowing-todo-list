document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('button');
    const toggleSwitch = document.querySelector('#checkbox');
    const themeText = document.getElementById('theme-text');
    let currentInput = "";

    function speak(text) {
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.2;
            const voiceMap = { '/': 'divided by', '*': 'times', '-': 'minus', '+': 'plus', '=': 'equals', 'C': 'clear', '.': 'point', '%': 'percent' };
            utterance.text = voiceMap[text] || text;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.log("Voice blocked by browser");
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.innerText;
            speak(value);

            button.classList.add('zoom-active');
            setTimeout(() => button.classList.remove('zoom-active'), 300);

            if (value === 'C') {
                currentInput = "";
                display.value = "0";
            } else if (value === '=') {
                try {
                    let result = eval(currentInput);
                    display.value = Number.isInteger(result) ? result : result.toFixed(3);
                    setTimeout(() => speak(display.value), 500);
                    currentInput = display.value.toString();
                } catch {
                    display.value = "Error";
                    speak("Error");
                    currentInput = "";
                }
            } else {
                if (display.value === "0" || display.value === "Error") currentInput = "";
                currentInput += value;
                display.value = currentInput;
            }
        });
    });

    toggleSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            themeText.innerText = "Light Mode";
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeText.innerText = "Dark Mode";
        }
    });
});
