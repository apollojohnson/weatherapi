/*
#############################
########## WEATHER ##########
#############################
*/

$(document).ready(function(){

    // fetch the user's current location with inbuilt GPS
    function getLocation(){

        // if it's supported:
        if(navigator.geolocation){
            // once getCurrentPosition happens, getWeather is the callback
            // only works if their browser is compatible
            // the "getWeather" callback is what asks the user "allow location?"
            navigator.geolocation.getCurrentPosition(getWeather);

        // if it's not supported:
        }else{
            alert("Geolocation not supported by this browser.");
        };
    };

    // define the getWeather function
    function getWeather(position){
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        let API_KEY = "82feb27d912b24be6512d0df615cc6a8";

        // baseURL is the API's endpoint
        let baseURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${API_KEY}`;

        // retrieves data from the API by sending the HTTP GET request
        // the GET request pulls data from a server
        $.get(baseURL,function(res){
            let data = res.current;
            // its in kelvin, so convert it to F
            let temp = Math.floor( (data.temp - 273.15)*(9/5)+32 );
            let condition = data.weather[0].description;
        
            // Display data on the web page with JQuery
            $('#condition').html(condition);
            $('#temp-main').html(`${temp}°F`);
        })
    }

    getLocation();
})

/*
#############################
########## POKEDEX ##########
#############################
*/

// add the reference to link to the html's ULs
const pokedex = document.getElementById('pokedex');

const fetchPokemon = () => {

    // empty array of promises
    const promises = [];

    //iterate thru all 150 and log it out
    for (let i = 1; i <= 150; i++) { 
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;

        // for each one of our requests, push that promise onto our list of promises
        promises.push(fetch(url).then((res) => res.json()));
    }
    
    // lets every individual asynchronally run in paralell (loads everything at once instead of one by one)
    Promise.all(promises).then((results) => {

        // create the pokemon
        // initialize it all in one line so we dont have to recreate it
        const pokemon = results.map((result) => ({
            name: result.name,
            image: result.sprites["front_default"],
            shiny: result.sprites["front_shiny"],
            type: result.types.map((type) => type.type.name).join(', '),
            id: result.id
        }));
        displayPokemon(pokemon);
    });
};

// call this function...
// we want to take each pokemon, and transform it into something that fits the format
const displayPokemon = (pokemon) => {
    console.log(pokemon);

    // 
    const pokemonHTMLString = pokemon
        .map(
            // name for each individual pokemon: poke
            // when poke is called, a list (li) of strings is returned
            (poke) => `
        <li class="card">
            <img class="card-image" src="${poke.image}"/>

            <h2 class="card-title">${poke.id}. ${poke.name}</h2>

            <p class="card-subtitle">Type: ${poke.type}</p>

            <a class="btn btn-success" href="https://www.serebii.net/pokedex-swsh/${poke.name}/" role="button">Serebii Info</a>
        </li>
    `
        )
        // (above) display image, name, then type
        .join('');
    pokedex.innerHTML = pokemonHTMLString;
};

fetchPokemon();
