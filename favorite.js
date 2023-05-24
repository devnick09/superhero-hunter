// selected favorite hero card ID
const favoriteCharacterList = document.getElementById('favoriteHero');

//created a event listner to run the function on page load
window.addEventListener('load', getCharacterList);
// it will trigger on clicking add to favorite button
favoriteCharacterList.addEventListener('click', removeToFavorite);

// get favorite character list here
function getCharacterList() {
    let favorites = JSON.parse(localStorage.getItem("favoriteList")) || [];

    if (favorites.length == 0 || favorites == null) {
        favoriteCharacterList.innerHTML = "No favorite character found in the list.";
        favoriteCharacterList.classList.add('notFound');
    }else{
            let html = "";
        
            // iterate over the favorite character list and generate a card for each favorite character
            favorites.forEach(superhero => {
                html += `
                    <div class = "hero-item" data-id = "${superhero.id}">
                        <div class = "hero-img">
                            <img src = "${superhero.image}" alt = "Character">
                        </div>
                        <div class = "hero-name" data-id = "${superhero.id}">
                            <h3>${superhero.name}</h3>
                            <div class="button-container">
                                <a href = "#" class="add-to-fav info-btn">Remove Favorite</a>
                            </div>
                        </div>
                    </div>
                `;
            });
            favoriteCharacterList.classList.remove('notFound');

            // update the html of favorite character list
            favoriteCharacterList.innerHTML = html;
    }
}

// 
function removeToFavorite(e){
    e.preventDefault();

    if (e.target.classList.contains('add-to-fav')) {  
        let hero = e.target.parentElement.parentElement;
        // console.log(hero);
        let favorites = JSON.parse(localStorage.getItem("favoriteList")) || [];
        let index = favorites.findIndex((f) => f.id == hero.dataset.id);
        if (index === -1) {
            favorites.push(heroInfo);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem("favoriteList", JSON.stringify(favorites));
        getCharacterList();
    }
    
      
}