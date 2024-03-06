import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_AUTO_CLOSE_SECS, API_KEY } from './config.js';

//

/* DON'T FORGET TO POLYFILL WITH PARCEL
install both with>>> npm i core-js regenerator-runtime */
import 'core-js/stable'; // polyfill everything else apart from async
import 'regenerator-runtime/runtime'; // polyfill Async Await
import paginationView from './views/paginationView.js';

// PARCEL ACCEPT HOT RELOAD
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    let hash = window.location.hash.slice(1).trim();
    // hash = hash === '' ? `5ed6604591c37cdc054bcac4` : hash;
    if (!hash) return;
    recipeView.renderSpinner();

    // 0. Update mouseClick state on left recipes.
    resultsView.update(model.getSearchResultsPagination()); //model.state.search.page

    // 1. Load Recipe
    await model.loadRecipe(hash);
    const recipe = model.state.recipe;

    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);

    // debugger;
    bookmarksView.update(model.state.bookmarks);
  } catch (error) {
    // throw error;
    recipeView.renderError();
    // console.log(`error control recipes`, error);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(`should see SPINNER on left`, resultsView);
    // 1) get search query from html
    const query = searchView.getQuery();
    if (!query) return;

    // 2) get search results from API
    await model.loadSearchResults(query);

    // show all recipes // resultsView.render(model.state.search.results);
    // 3) render results with Pagination
    resultsView.render(model.getSearchResultsPagination(model.state.search.page));

    // 4) Render Pagination
    paginationView.render(model.state.search);
  } catch (error) {
    throw error;
  }
};

const controlPaginationClick = function (gotoPage) {
  // 3) render results with Pagination
  resultsView.render(model.getSearchResultsPagination(gotoPage));
  model.state.search.page = +gotoPage;
  // 4) Render Pagination
  paginationView.render(model.state.search);
};

const controlRecipePortions = function (newServing) {
  // update the recipe servings (in state)
  model.updateServings(newServing);
  // update the view.
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove Bookmark
  if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }
  // 2) Render recipe view
  recipeView.update(model.state.recipe);

  // 3) Render BookMark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipeFormData) {
  try {
    // Show Spinner
    addRecipeView.renderSpinner();

    // Upload recipe
    await model.uploadRecipe(newRecipeFormData);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    //Update view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);
    // Close modal window in x Seconds
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_AUTO_CLOSE_SECS * 1000);

    // bookmarksView.update(model.state.bookmarks);
  } catch (error) {
    console.error(`💥`, error);
    addRecipeView.renderError(error.message);
  }
};

// PUBLISHER SUBSCRIBER PATTERN
// This is the subscriber, the publisher is in the View
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRenderer(controlRecipes);
  recipeView.addHandlerUpdateServings(controlRecipePortions);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPaginationClick);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
