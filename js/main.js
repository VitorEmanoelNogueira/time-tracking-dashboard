const buttons = document.querySelectorAll('[data-period]');
let activeButton = document.querySelector('.is-active');

// spread operator used to turn NodeList into an array and be able to use .map()
const cards = [...document.querySelectorAll('.c-card')].map((card) => {
    return{
        currentTime: card.querySelector('.js-current-time'),
        previousTime: card.querySelector('.js-previous-time')
    }
});

let userTimes;

const labels = {
    daily: "Yesterday",
    weekly: "Last Week",
    monthly: "Last Month"
}

fetch('data.json').then((response) => {
    return response.json();
}).then((data) => {
    userTimes = data;
    init();
})

function init(){
    showTime(activeButton.dataset.period);

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if(button === activeButton) return;
    
            updateActiveButton(button)
        })
    })
}

function showTime(period){
    cards.forEach((card, i) => {
        const timeframe = userTimes[i].timeframes[period];

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
}