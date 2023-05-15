import * as flsFunctions from "./modules/functions.js";

flsFunctions.isWebp();


const api = 'cfb2790933804337b0fd3a0bf02351b4';
const form = document.querySelector('.search__form');
const input = document.querySelector('.search__input');
const header = document.querySelector('.header');

form.addEventListener('submit', handleSubmit);

function showCard(data, header) {
const cardsHTML = data.map((item) => {
const title = item.title;
const image = item.image;
const usefulIngredients = item.usedIngredients
    .map((ingredient) => {
    return `<li class="card__item">${ingredient.name}</li>`;
    })
    .join('');
const uselessIngredients = item.unusedIngredients
    .map((ingredient) => {
    return `<li class="card__item">${ingredient.name}</li>`;
    })
    .join('');
const needToBuy = item.missedIngredients
    .map((ingredient) => {
    return `<li class="card__item">${ingredient.name}</li>`;
    })
    .join('');
return `<div class="card">
    <div class="card__main">
        <h1 class="card__title">${title}</h1>
        <img src="${image}" alt="img" class="card__img">
    </div>
    <div class="card__ingredients">
        <div class="card__ingredients-use">
            <h3 class="card__ingredients-title">Полезные ингредиенты</h3>
            <ol class="card__list">
                ${usefulIngredients}
            </ol>
        </div>
        <div class="card__ingredients-useless">
            <h3 class="card__ingredients-title">Бесполезные ингредиенты</h3>
            <ol class="card__list">
                ${uselessIngredients}
            </ol>
        </div>
    </div>
    <div class="card__needtobuy">
        <h3 class="card__ingredients-title">Необходимые ингредиенты для покупки</h3>
        <ol class="card__list">
            ${needToBuy}
        </ol>
    </div>
</div>`;
});

const html = cardsHTML.join('');
header.insertAdjacentHTML('afterend', html);
}

function removeCard() {
const prevCard = document.querySelector('.card');
if (prevCard) prevCard.remove();
}

function showError(header) {
if (header) {
let html = `<div class="card">Вы указали продукты, которых не существует</div>`;
header.insertAdjacentHTML('afterend', html);
}
}

function handleSubmit(event) {
event.preventDefault();

const ingredients = input.value.split(' ').map((ingredient) => ingredient.trim());
const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${api}&ingredients=${ingredients.join(',+')}&number=2`;
console.log(url);
fetch(url)
.then((response) => response.json())
.then((data) => {
    removeCard();

    if (!data || data.length === 0) {
    showError(header);
    } else {
    showCard(data, header);
    }
})
.catch((error) => {
    console.error('Error:', error);
});
}
