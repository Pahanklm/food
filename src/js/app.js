import * as flsFunctions from './modules/functions.js';

flsFunctions.isWebp();
const api = 'cfb2790933804337b0fd3a0bf02351b4';
const form = document.querySelector('.search__form');
const input = document.querySelector('.search__input');
const header = document.querySelector('.header');

form.addEventListener('submit', handleSubmit);

async function showCard(data, header) {
    const allIngredients = [];

    data.forEach((item) => {
        const usefulIngredients = item.usedIngredients.map(
            (ingredient) => ingredient.name
        );
        const uselessIngredients = item.unusedIngredients.map(
            (ingredient) => ingredient.name
        );
        const needToBuy = item.missedIngredients.map(
            (ingredient) => ingredient.name
        );

        allIngredients.push(
            ...usefulIngredients,
            ...uselessIngredients,
            ...needToBuy
        );
    });

    try {
        const translatedIngredients = await translateText(
            allIngredients,
            'en',
            'ru'
        );

        let currentIndex = 0;

        const html = data
            .map((item) => {
                const title = item.title;
                const image = item.image;

                const usefulIngredients = item.usedIngredients.map(() => {
                    const translatedText =
                        translatedIngredients[currentIndex++];
                    return `<li class="card__item">${translatedText}</li>`;
                });

                const uselessIngredients = item.unusedIngredients.map(() => {
                    const translatedText =
                        translatedIngredients[currentIndex++];
                    return `<li class="card__item">${translatedText}</li>`;
                });

                const needToBuy = item.missedIngredients.map(() => {
                    const translatedText =
                        translatedIngredients[currentIndex++];
                    return `<li class="card__item">${translatedText}</li>`;
                });

                return `<div class="card">
            <div class="card__main">
              <h1 class="card__title">${title}</h1>
              <img src="${image}" alt="img" class="card__img">
            </div>
            <div class="card__ingredients">
              <div class="card__ingredients-use">
                <h3 class="card__ingredients-title">Полезные ингредиенты</h3>
                <ol class="card__list">
                  ${usefulIngredients.join('')}
                </ol>
              </div>
              <div class="card__ingredients-useless">
                <h3 class="card__ingredients-title">Бесполезные ингредиенты</h3>
                <ol class="card__list">
                  ${uselessIngredients.join('')}
                </ol>
              </div>
            </div>
            <div class="card__needtobuy">
              <h3 class="card__ingredients-title">Необходимые ингредиенты для покупки</h3>
              <ol class="card__list">
                ${needToBuy.join('')}
              </ol>
            </div>
          </div>`;
            })
            .join('');

        header.insertAdjacentHTML('afterend', html);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function removeCard() {
    const prevCards = document.querySelectorAll('.card');
    prevCards.forEach((card) => card.remove());
}

function showError(header) {
    if (header) {
        let html = `<div class="card">Вы указали продукты, которых не существует</div>`;
        header.insertAdjacentHTML('afterend', html);
    }
}

async function translateText(message, l1, l2) {
    const url = 'https://translatorxpress.p.rapidapi.com/translator';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key':
                '765841ae3fmsh6bbd89bb69219dbp12cb01jsn55389ae4f28a',
            'X-RapidAPI-Host': 'translatorxpress.p.rapidapi.com',
        },
        body: JSON.stringify({
            from: `${l1}`,
            to: `${l2}`,
            text: message,
        }),
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (result.trans) {
            return result.trans
                .split(' ')
                .map((ingredient) => ingredient.trim());
        } else {
            throw new Error('Translation not available');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const ingredients = input.value;

    try {
        const translatedIngredients = await translateText(
            ingredients,
            'ru',
            'en'
        );
        const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${api}&ingredients=${translatedIngredients.join(
            ','
        )}&number=2`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data || data.length === 0) {
            showError(header);
        } else {
            await removeCard();
            showCard(data, header);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const inputTranslate = document.querySelector('.translate__form--input');
const translateBtn = document.querySelector('.translate__form--btn');

translateBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const message = inputTranslate.value;
    translateText(message)
        .then((translatedMessage) => {
            console.log(translatedMessage);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
