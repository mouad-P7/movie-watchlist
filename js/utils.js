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
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movieName)}`);
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
    for(const [i, movie] of moviesArray.entries()){
      const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`);
      const movieData = await response.json();
      if(movieData.Response === "True")
        moviesCtr.innerHTML += getMovieHtml(movieData, source);
    }
    for(const [i, movie] of moviesArray.entries()){
      let addBtn = document.getElementsByClassName('add-to-watchlist-btn')[i];
      if(!addBtn) continue;
      addBtn.addEventListener('click', e => addToWatchlistEvent(e, movie));
    }
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
    if(watchlist.some(item => item.Title == movie.Title))
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
    `<div class="movie-ctr" data-title="${movie.Title}">
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
    console.log('movie added \n' + movie)
  }
  console.log('movie not added \n' + movie)
};


function removeFromWatchListEvent(event, movie){
  console.log(event.target);
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  for(let item of watchlist){
    console.log(item);
  }
};

