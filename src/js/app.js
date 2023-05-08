import * as flsFunctions from "./modules/functions.js";

flsFunctions.isWebp();


const api = 'cfb2790933804337b0fd3a0bf02351b4';

    const url = `https://api.spoonacular.com/recipes/716429/information?apiKey=${api}&includeNutrition=true`
    fetch(url)
        .then((response) => {
            response.json()
            console.log(response);
        })