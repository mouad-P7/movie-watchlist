import { displayMovies } from "./utils";


document.addEventListener('DOMContentLoaded', () => {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if(!watchlist || watchlist.length === 0) 
    return;
  displayMovies(watchlist, 'localStorage');
});

