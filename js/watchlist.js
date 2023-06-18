import { getMoviesHtml, removeFromWatchListEvent } from "./utils";


// localStorage.removeItem('moviesArray')
const mainEl = document.querySelector('main');
const moviesArray = JSON.parse(localStorage.getItem('moviesArray')) || [];
console.log('moviesArray: \n\n'+moviesArray)
if(moviesArray && moviesArray != '[object Object]'){
  mainEl.innerHTML = '<div id="movies-ctr"></div>';
  const moviesCtr = document.getElementById('movies-ctr');
  const addBtns = document.getElementsByClassName('remove-from-watchlist-btn');
  for(let movie of moviesArray){ 
    console.log('movie: \n\n'+movie);
    moviesCtr.innerHTML += getMoviesHtml(JSON.parse(movie), 'localStorage'); 
  }
  for(let btn of addBtns)
    btn.addEventListener('click', removeFromWatchListEvent);
}
