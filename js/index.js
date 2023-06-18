import { getMoviesHtml, addToWatchListEvent } from "./utils";


const apiKey = '2bf9339a';
const mainEl = document.querySelector('main');
const searchBtn = document.getElementById('search-btn');
let moviesIdArray = [];


document.getElementById('search-form').addEventListener('submit', async e => {
  e.preventDefault();
  const movieName = e.target.querySelector('#search-input').value;
  searchBtn.disabled = true;
  searchBtn.querySelector('#search-btn-text').classList.toggle('hidden');
  searchBtn.querySelector('.loader-ctr').classList.toggle('hidden');

  // Get an array of matching films inside the data object, then push the ID of each film into moviesIdArray
  try{
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movieName)}`);
    if(!response.ok)
      throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    if(data.Response === 'False')
      mainEl.innerHTML = 
        `<p>
          Unable to find what you are looking for. Please try another search.
        </p>`;
    else if(data.Response === 'True'){
      // Fetch each movie by ID and render it in moviesCtr
      console.log(data.Search)
      moviesIdArray = data.Search.map(movie => movie.imdbID);
      mainEl.innerHTML = '<div id="movies-ctr"></div>';
      const moviePromises = moviesIdArray.map(async movieId => {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      });

      try{
        const movieArray = await Promise.all(moviePromises);
        const moviesCtr = document.getElementById('movies-ctr');
        const addBtns = document.getElementsByClassName('add-to-watchlist-btn');
        for(const movie of movieArray)
          if(movie) moviesCtr.innerHTML += getMoviesHtml(movie, 'api');
        // Add event listeners to watchlist buttons
        for(let btn of addBtns)
          btn.addEventListener('click', addToWatchListEvent);
      }catch(error){
        console.error('Promise.all error:', error);
      }

    }
  }catch(error){
    console.log('API error: ' + error);
  }finally{
    searchBtn.querySelector('.loader-ctr').classList.toggle('hidden');
    searchBtn.querySelector('#search-btn-text').classList.toggle('hidden');
    searchBtn.disabled = false;
    e.target.reset();
  }
  
});

