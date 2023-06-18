export { getMoviesHtml, addToWatchListEvent, removeFromWatchListEvent };


function getMoviesHtml(movie, source){
  let btnEl = '';
  if(source == 'api') btnEl = addToWatchlistBtnHtml(movie);
  else if(source == 'localStorage') btnEl = removeFromWatchlistBtnHtml(movie);
  else console.error('generateMovieHtml source error');
  return(
    `<div class="movie-ctr" data-title=${movie.Title}>
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


function addToWatchListEvent(event){
  event.target.disabled = true;
  // movieToAdd is already JSON.stringify
  const movieToAdd = event.target.dataset.movie;
  let moviesArray = localStorage.getItem('moviesArray');
  if(!moviesArray && moviesArray == '[object Object]')
    moviesArray = [];
  moviesArray = JSON.parse(localStorage.getItem('moviesArray')) || [];
  moviesArray.unshift(movieToAdd);
  localStorage.setItem('moviesArray', JSON.stringify(moviesArray));
  console.log('movie added')
};


function removeFromWatchListEvent(event){
  console.log(event.target);
  const moviesArray = JSON.parse(localStorage.getItem('moviesArray')) || [];
  for(let element of moviesArray){
    console.log(element)
  }
};


function addToWatchlistBtnHtml(movie){
  let disabled = '';
  const moviesArray = JSON.parse(localStorage.getItem('moviesArray')) || [];
  console.log('moviesArray: ' + moviesArray)
  // for(let element of moviesArray){
  //   console.log('movie: ' + element)
  //   if(JSON.parse(element).Title == movie.Title){
  //     console.log(JSON.parse(element).Title + 'added')
  //     disabled = 'disabled';
  //     break;
  //   }
  // }
  return(
    `<button ${disabled} class="add-to-watchlist-btn" data-movie='${JSON.stringify(movie)}'>
      <i class="fa-solid fa-circle-plus circle-plus-icon"></i>           
      <p>Watchlist</p>
    </button>`
  );
};


function removeFromWatchlistBtnHtml(movie){
  return(
    `<button class="remove-from-watchlist-btn" data-movie='${JSON.stringify(movie)}'>
      <i class="fa-solid fa-circle-minus circle-minus-icon"></i>
      <p>Remove</p>
    </button>`
  );
};
