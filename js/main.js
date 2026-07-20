const buttons = document.querySelectorAll('[data-period]');
let activeButton = document.querySelector('.is-active');

// spread operator used to turn NodeList into an array and be able to use .map()
const cards = [...document.querySelectorAll('.c-card')].map((card) => {
    return{
        currentTime: card.querySelector('.js-current-time'),
        previousTime: card.querySelector('.js-previous-time')
    }
});

let userTimes = [];

const labels = {
    daily: "Yesterday",
    weekly: "Last Week",
    monthly: "Last Month"
}

const dashboardStatus = document.getElementById('dashboard-status');


async function init() {
    try {
        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error("Failed to fetch dashboard data.");
        }

        userTimes = await response.json();

        if (!activeButton) {
            throw new Error("Expected an active timeframe button.");
        }

        showTime(activeButton.dataset.period);

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                if (button === activeButton) return;

                updateActiveButton(button);
            });
        });

    } catch (error) {
        console.error(error);
    }
}

init();

function showTime(period){
    cards.forEach((card, i) => {
        const timeframe = userTimes[i]?.timeframes?.[period];

        if (!timeframe){
            throw new Error(`Missing timeframe "${period}" for card ${i}.`)
        }

        card.currentTime.textContent = `${timeframe.current}hrs`;
        card.previousTime.textContent = `${labels[period]} - ${timeframe.previous}hrs`
    })
}

function updateActiveButton(button) {
    activeButton.classList.remove('is-active');
    activeButton.setAttribute("aria-pressed", "false");
    
    button.classList.add('is-active');
    button.setAttribute("aria-pressed", "true");
    
    activeButton = button;
    showTime(activeButton.dataset.period);
    dashboardStatus.textContent = `Showing ${button.dataset.period} data.`;
}