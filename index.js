const searchBtn = document.getElementById('search-btn');
const characterList = document.getElementById('hero');
const heroDetailsContent = document.querySelector('.hero-details-content');
const heroInfoCloseBtn = document.getElementById('heroInfo-close-btn');

// event listeners trigger on search button
searchBtn.addEventListener('click', getCharacterList);
// this event will trigger on any keypress
document.addEventListener('keypress', getCharacterList);
// this event will trigger on character card button click
characterList.addEventListener('click', getCharacterInfo);

// click event to close Character info modal 
heroInfoCloseBtn.addEventListener('click', () => {
    heroDetailsContent.parentElement.classList.remove('showheroInfo');
});


// get hero list that matches with the input value
function getCharacterList(e){

    // let PUBLIC_KEY = "1ec60b03bfe3da3c10d6bbb09f319e8b";
    // let PRIVATE_KEY = "ad2aec142d3becad9ed7528921a197302357e3f5";

    // let ts = new Date().getTime();

    // genarated hash key with cryptoJs library
    // let hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
    // console.log(hash);
    // console.log(ts);

    // selecting input value 
    let searchInputTxt = document.getElementById('search-input').value.trim();

    // check if input value is not empty
    if (searchInputTxt.length == 0) {
        // if empty then update the inner html value of card list
         characterList.innerHTML = "Please Enter Character Name!";
         characterList.classList.add('notFound');
         return;
    }

    // fetching the data from the MARVEL API and passing input value in the api end point
    fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchInputTxt}&ts=1684663308770&apikey=1ec60b03bfe3da3c10d6bbb09f319e8b&hash=484c3bb8ad15811351ff37ece330457c`)
    .then(response => response.json())
    .then(data => {
        // prepare html
        let html = "";
        // check if the response data is not empty
        if(data.data.count !== 0){
            // iterate over the all the data and generate hero card
            data.data.results.forEach(superhero => {
                html += `
                    <div class = "hero-item" data-id = "${superhero.id}">
                        <div class = "hero-img">
                            <img src = "${superhero.thumbnail.path +'.'+ superhero.thumbnail.extension}" alt = "Character">
                        </div>
                        <div class = "hero-name" data-id = "${superhero.id}">
                            <h3>${superhero.name}</h3>
                            <div class="button-container">
                                <a href = "#" class="info-btn">Get Info</a>
                                <a href = "#" class="add-to-fav"><i class="fa-regular fa-heart"></i></a>
                            </div>
                        </div>
                    </div>
                `;
            });
            characterList.classList.remove('notFound');
        // if response data is empty then show not found message
        } else{
            html = "Sorry, we didn't find any Character!";
            characterList.classList.add('notFound');
        }

        // update character list html
        characterList.innerHTML = html;

        //Update favorite button state
        genarateButton();
    });
}


// get character info 
function getCharacterInfo(e){
    
    // prevent default is used to prevent page loading on button click
    e.preventDefault();

    // fetch data in character modal if clicked on get info button
    if(e.target.classList.contains('info-btn')){
        let hero = e.target.parentElement.parentElement;
        fetch(`https://gateway.marvel.com/v1/public/characters/${hero.dataset.id}?&ts=1684663308770&apikey=1ec60b03bfe3da3c10d6bbb09f319e8b&hash=484c3bb8ad15811351ff37ece330457c`)
        .then(response => response.json())
        .then(data => characterModal(data.data.results));
    }

    // fetch data to update button state and localstorage if clicked on add-to-fav button
    if (e.target.classList.contains('add-to-fav')) {
        const buttons = document.querySelectorAll('.add-to-fav');   
        
        let hero = e.target.parentElement.parentElement;
        fetch(`https://gateway.marvel.com/v1/public/characters/${hero.dataset.id}?&ts=1684663308770&apikey=1ec60b03bfe3da3c10d6bbb09f319e8b&hash=484c3bb8ad15811351ff37ece330457c`)
        .then(response => response.json())
        .then(data => {
        
            // iterate over all the buttons and update the icons and localstorage
            buttons.forEach(button => {

                // select button parent ID 
                const btnParentID = button.parentElement.parentElement.dataset.id;
                // select button class Name
                const checkClassName = button.childNodes[0].classList;

                // check if selected button ID is matching with data's ID and containing 'fa-regular' class
                if (data.data.results[0].id == btnParentID && checkClassName.contains('fa-regular')) {
                    // add icon and title to the button
                    button.innerHTML = '<i class="fa-solid fa-heart"></i>';
                    button.title = "remove favorite hero";

                    // prepare data to save it in the localstorage
                    const heroInfo = {
                        id: data.data.results[0].id,
                        name: data.data.results[0].name,
                        image: data.data.results[0].thumbnail.path + '.' + data.data.results[0].thumbnail.extension,
                    }

                    // calling add-to-favorite function and passing heroInfo
                    addToFavorite(heroInfo);

                // check if selected button ID is matching with data's ID and containing 'fa-solid' class
                }else if(data.data.results[0].id == btnParentID && checkClassName.contains('fa-solid')){
                    // add icon and title to the button
                    button.innerHTML = '<i class="fa-regular fa-heart"></i>';
                    button.title = "add favorite hero";
                    // prepare data to remove from localstorage
                    const heroInfo = {
                        id: data.data.results[0].id
                    }

                    // calling remove favorite function and passing Character ID
                    removeToFavorite(heroInfo);
                }
            });
        });
    }
}

// created a character modal to show character info
function characterModal(heroData){

    // get hero data in variable
    hero = heroData[0];

    // get character events information
    var eventsItem = hero.events.items;
    // get character comics information
    var comicsName = hero.comics.items;

    // prepare html for the character modal
    let html = `
        <h2 class = "heroInfo-title">Name: ${hero.name}</h2>
        <div class = "heroInfo-hero-img">
            <img src = "${hero.thumbnail.path +'.'+ hero.thumbnail.extension}" alt = "Character">
        </div>
       
        <div class = "heroInfo-instruct">
            <h3>Description:</h3>
            <p>${hero.description}</p>
        </div>
        <div class = "heroInfo-instruct">
            <h3>Events:</h3>
            <div id = "eventDiv">
                
            </div>
        </div>
        <div class = "heroInfo-instruct">
            <h3>Comics:</h3>
            <div id = "comics">
                
            </div>
        </div>
       
    `;

    // update character modal html
    heroDetailsContent.innerHTML = html;
    // add show info class
    heroDetailsContent.parentElement.classList.add('showheroInfo');

    // selected eventDiv
    const eventDiv = document.getElementById('eventDiv');
    // selected comics div
    const comicsDiv = document.getElementById('comics');

    // iterate through events item and add them to span element
    for (const key in eventsItem) {

        const span = document.createElement('span');
        span.textContent = eventsItem[key].name;
        eventDiv.appendChild(span);
        if (key != (eventsItem.length - 1)) {
            eventDiv.appendChild(document.createTextNode(', '));
        }

    }
    // iterate through comics items and add them to span element
    for (const key in comicsName) {

        const span = document.createElement('span');
        span.textContent = comicsName[key].name;
        comicsDiv.appendChild(span);
        if (key != (comicsName.length - 1)) {
            comicsDiv.appendChild(document.createTextNode(', '));
        }


    }
}

//Add characters to favorite function
function addToFavorite(heroInfo){

    // check if we already have favorite list items
    let favorites = JSON.parse(localStorage.getItem("favoriteList")) || [];

    // push heroInfo into favorites array
    favorites.push(heroInfo);
    
    // update favorite list
    localStorage.setItem('favoriteList', JSON.stringify(favorites));

}

// function to remove favorite hero info from favorites
function removeToFavorite(heroInfo){
    
     // check if we already have favorite list items
    let favorites = JSON.parse(localStorage.getItem("favoriteList")) || [];

    // check if hero info id is matching with favorites list item id
    let index = favorites.findIndex((f) => f.id === heroInfo.id);
    if (index === -1) {
        // push hero info to favorites list if ID not matching 
        favorites.push(heroInfo);
    } else {
        // remove from favorites list if ID matching
        favorites.splice(index, 1);
    }

    // update favorites list
    localStorage.setItem("favoriteList", JSON.stringify(favorites));
      
}

// function to generate favorites add or remove icon 
function genarateButton(){

    // select all favorite buttons
    const buttons = document.querySelectorAll('.add-to-fav');   

     // check if we already have favorite list items
    let favorites = JSON.parse(localStorage.getItem("favoriteList")) || [];

    // iterate through all buttons and add icons
    buttons.forEach(button => {

        // check if ID is matching
        let index = favorites.findIndex((f) => f.id == button.parentElement.parentElement.dataset.id);
        if (index === -1) {
            // add empty heart icon if ID is not matching
            button.innerHTML = '<i class="fa-regular fa-heart"></i>';
            button.title = "Add favorite hero";
        } else {
            // add filled heart icon if ID is matching
            button.innerHTML = '<i class="fa-solid fa-heart"></i>';
            button.title = "Remove favorite hero";
        }
    });
      
}
