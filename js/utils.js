export { renderBtnAnimation, SearchForMovies, displayMovies };


const apiKey = '2bf9339a';
const mainEl = document.querySelector('main');


function renderBtnAnimation(btn, action){
  if(action === 'add'){  
    btn.disabled = true;
    btn.querySelector('#search-btn-text').classList.toggle('hidden');
    btn.querySelector('.loader-ctr').classList.toggle('hidden');
  }else if(action === 'remove'){
    btn.querySelector('.loader-ctr').classList.toggle('hidden');
    btn.querySelector('#search-btn-text').classList.toggle('hidden');
    btn.disabled = false;
  }else 
    console.error('Non valid action in renderBtnAnimation function');
};


async function SearchForMovies(movieName){
  try{
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movieName)}`);
    if(!response.ok)
      throw new Error(`HTTP error! Status: ${response.status}`);
    const movieData = await response.json();
    if(movieData.Response === 'True'){
      await displayMovies(movieData.Search, 'api');
    }else if(movieData.Response === 'False'){
      mainEl.innerHTML = 
      `<p>
        Unable to find what you are looking for. Please try another search.
      </p>`;
    }
  }catch(error){
    console.error('API error: ' + error);
  }
};


async function displayMovies(moviesArray, source){
  mainEl.innerHTML = '<div id="movies-ctr"></div>';
  const moviesCtr = document.getElementById('movies-ctr');
  moviesCtr.style.zIndex = '-1';
  try{
    if(source === 'api'){
      let moviesDataArray = [];
      for(const movie of moviesArray){
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`);
        const movieData = await response.json();
        if(movieData.Response === "True"){
          moviesCtr.innerHTML += getMovieHtml(movieData, source);
          moviesDataArray.push(movieData);
        }
      }
      for(const [i, movie] of moviesDataArray.entries()){
        let addBtn = document.getElementsByClassName('add-to-watchlist-btn')[i];
        if(!addBtn) continue;
        addBtn.addEventListener('click', e => addToWatchlistEvent(e, movie));
      }
    }else if(source === 'localStorage'){
      for(const movie of moviesArray)
        moviesCtr.innerHTML += getMovieHtml(movie, source);
      for(const [i, movie] of moviesArray.entries()){
        let removeBtn = document.getElementsByClassName('remove-from-watchlist-btn')[i];
        if(!removeBtn) continue;
        removeBtn.addEventListener('click', e => 
          removeFromWatchListEvent(e, movie));
      }
    }else 
      console.error('source: api or localStorage ??');
  }catch(error){
    console.error(error);
  }finally{
    moviesCtr.style.zIndex = '1';
  }
};


function getMovieHtml(movie, source){
  let btnEl = '';
  if(source === 'api'){
    let disabled = '';
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if(watchlist.some(item => item.imdbID == movie.imdbID))
      disabled = 'disabled';
    btnEl = 
      `<button ${disabled} class="add-to-watchlist-btn">
        <i class="fa-solid fa-circle-plus circle-plus-icon"></i>           
        <p>Watchlist</p>
      </button>`;
  }
  else if(source === 'localStorage'){
    btnEl = 
      `<button class="remove-from-watchlist-btn">
        <i class="fa-solid fa-circle-minus circle-minus-icon"></i>
        <p>Remove</p>
      </button>`;
  }
  else
    console.error('generateMovieHtml source error');
  return(
    `<div class="movie-ctr" id="${movie.imdbID}">
      <div class="movie-poster-ctr">
        <img class="movie-poster bg-img" src="${movie.Poster}" alt="poster">
      </div>
      <div class="movie-info-ctr">
        <div class="movie-title-rating-ctr">
          <h2 class="movie-title">${movie.Title}</h2>
          <i class="fa-solid fa-star star-icon"></i>
          <p class="movie-rating">${movie.imdbRating}</p>
        </div>
        <div class="movie-runtime-genre-ctr">
          <p class="movie-runtime">${movie.Runtime}</p>
          <p class="movie-genre">${movie.Genre}</p>
          ${btnEl}
        </div>
        <p class="movie-plot">${movie.Plot}</p>
      </div>
      <hr class="movie-hr">
    </div>`
  );
};


function addToWatchlistEvent(event, movie){
  event.target.disabled = true;
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if(!watchlist.some(item => item.imdbID === movie.imdbID)){
    watchlist.unshift(movie);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }
};


function removeFromWatchListEvent(event, movie){
  const movieId = event.target.parentNode.parentNode.parentNode.id;
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  watchlist = watchlist.filter(item => item.imdbID !== movie.imdbID);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  document.getElementById(movieId).remove();
  if(watchlist.length === 0){
    mainEl.innerHTML = 
      `<p>Your watchlist is looking a little empty...</p>
      <button class="add-movies-btn" onclick="window.location.href = '../index.html'">
        <i class="fa-solid fa-circle-plus circle-plus-icon"></i>
        <p>Let's add some movies!</p>
      </button>`;
  }
};

