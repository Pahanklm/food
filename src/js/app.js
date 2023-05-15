import * as flsFunctions from "./modules/functions.js";

flsFunctions.isWebp();


const api = 'cfb2790933804337b0fd3a0bf02351b4';
const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${api}&ingredients=sausages,cucumbers,peppers&number=2`;
const header = document.querySelector('.header');

function showCard(data, header) {
    let html = '';
    
    for (let i = 0; i < data.length; i++) {
        let title = data[i].title;
        let image = data[i].image;
        let usefullIngredients = data[i].usedIngredients;
        for(let j = 0; j < usefullIngredients.length; j++){
            let name = usefullIngredients[j].name
            console.log(name);
        }

        html += `<div class="card">
            <div class="card__main">
                <h1 class="card__title">${title}</h1>
                <img src="${image}" alt="img" class="card__img">
            </div>
            <div class="card__ingredients">
                <div class="card__ingredients-use">
                    <h3 class="card__ingredients-title">useful ingredients</h3>
                    <ol class="card__list">
                        <li class="card__item">1</li>
                    </ol>
                </div>
                <div class="card__ingredients-useless">
                    <h3 class="card__ingredients-title">useless ingredients</h3>
                    <ol class="card__list">
                        <li class="card__item">1</li>
                    </ol>
                </div>
            </div>
            <div class="card__needtobuy">
                <h3 class="card__ingredients-title">ingredients need to buy</h3>
                <ol class="card__list">
                    <li class="card__item">1</li>
                </ol>
            </div>
        </div>`;
    }

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

fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        if (!data || data.length === 0) {
            removeCard();
            showError(header);
        } else {
            removeCard();
            showCard(data, header);
        }
    });
