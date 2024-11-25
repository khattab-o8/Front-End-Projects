import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmark.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // Polyfilling everything else
import 'regenerator-runtime/runtime'; // Polyfilling async/await

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; // Gaurd clause

    recipeView.renderSpinner();

    // 0- Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookMarks);

    // 1- Loading recipe
    await model.loadRecipe(id);

    // 2- Rendering recipe
    console.log(model.state.recipe);
    recipeView.reder(model.state.recipe);
  } catch (err) {
    // Handling Error
    console.error(`🚨❗ ${err.message} 💥⚠️`);
    addRecipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.reder(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.reder(model.state.search);
  } catch (err) {
    // Handling Error
    console.error(`🚨❗ ${err.message} 💥⚠️`);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.reder(model.getSearchResultsPage(goToPage));

  // 2) Render NEW initial pagination buttons
  paginationView.reder(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.reder(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  // 1) Add/Remove BookMark
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render book mark
  bookmarkView.reder(model.state.bookMarks);
};

const controlAddBookMarks = function () {
  bookmarkView.reder(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.reder(model.state.recipe);
    console.log(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render Bookmarks
    bookmarkView.reder(model.state.bookMarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`💥🐞${err.message}❗⚠️`);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerLocalStorageBookmarks(controlAddBookMarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
