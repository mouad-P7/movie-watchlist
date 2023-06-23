import { renderBtnAnimation, SearchForMovies } from "./utils";


const searchBtn = document.getElementById('search-btn');


document.getElementById('search-form').addEventListener('submit', async e => {
  e.preventDefault();
  renderBtnAnimation(searchBtn, 'add');
  await SearchForMovies(document.getElementById('search-input').value);
  renderBtnAnimation(searchBtn, 'remove');
  e.target.reset();
});

