const buttons = document.querySelectorAll('[data-period]');
let activeButton = document.querySelector('.is-active');

// spread operator used to turn NodeList into an array and be able to use .map()
const cards = [...document.querySelectorAll('.c-card')].map((card) => {
    return{
        current: card.querySelector('.js-current-time'),
        previous: card.querySelector('.js-previous-time')
    }
});

let json;

fetch('data.json').then((response) => {
    return response.json();
}).then((data) => {
    json = data;
    showTime(activeButton.dataset.period);
})

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if(button === activeButton) return;

        activeButton.classList.remove('is-active');
        activeButton.setAttribute("aria-pressed", "false");
        
        button.classList.add('is-active');
        button.setAttribute("aria-pressed", "true");
        
        activeButton = button;

        showTime(button.dataset.period);
    })
})

function showTime(period){
    const labels = {
        daily: "Yesterday",
        weekly: "Last Week",
        monthly: "Last Month"
    }

    cards.forEach((card, i) => {
        const timeframe = json[i].timeframes[period];

        card.current.textContent = `${timeframe.current}hrs`;
        card.previous.textContent = `${labels[period]} - ${timeframe.previous}hrs`
    })
}