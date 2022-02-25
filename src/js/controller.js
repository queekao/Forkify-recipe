// import render from 'dom-serializer';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultView from './views/searchResultView.js';
import paginationView from './views/paginationView.js';
import 'core-js/stable'; //polyfilling for everything
import 'regenerator-runtime/runtime'; //polyfilling for async await
import { async } from 'regenerator-runtime';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { SUBMIT_FORM_SEC } from './config.js';
// const recipeContainer = document.querySelector('.recipe');
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
// https://forkify-api.herokuapp.com/v2 (API)

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
  //Come from 'parcel' hot module reloading
  //it may perform Hot Module Replacement (HMR).
  //HMR improves the development experience by updating modules in the browser
  //at runtime without needing a whole page refresh.
}
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(window.location);
    //first charater is '#' and listen to load event
    // console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    //if the interface didnt catch the 'id' will keep loading
    // 0 )) update recipe
    bookmarkView.update(model.state.bookmark);
    searchResultView.update(model.resultPerPage());
    // 1 )) loading recipe
    const { recipe } = model.state;
    await model.loadRecipe(id); //this async will return promise so we need to await it
    // 2 ) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchRecipe = async function () {
  try {
    searchResultView.renderSpinner(); //inheritant the parent's spinner
    // 1 ) get search query
    let query = searchView.getQuery();
    if (!query) return; // dont let it keep loading
    // 2 ) load search results
    await model.loadSearchResult(query);
    // 3 ) Render results
    console.log(model.state.searchRecipe.results);
    // searchResultView.render(model.state.searchRecipe.results); //All results
    searchResultView.render(model.resultPerPage());
    // 4 ) Load pagination btn
    paginationView.render(model.state.searchRecipe); //now we pass results to this._data
    // 5 ) delete recipe
    searchResultView.deleteRecipe(model.state.searchRecipe.results);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1 ) Render NEW results
  searchResultView.render(model.resultPerPage(goToPage));
  // 2 ) Load NEW pagination btn
  paginationView.render(model.state.searchRecipe);
};
const controlServings = function (servings) {
  // 1 ) update servings data
  model.updateServings(servings);
  //we can just re-render here
  // 1 ) render servings data
  // recipeView.render(model.state.recipe);
  //'Serving' is 'recipeView' so we do create event in the 'recipeView'
  recipeView.update(model.state.recipe);
  //instead of re-render the whole page just update the change part of html
};
const controlAddBookmark = function () {
  // if there isnt bookmark add bookmark
  if (!model.state.recipe.bookmarked) model.updateBookmark(model.state.recipe);
  // if there is bookmark remove bookmark
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);
  console.log(model.state.bookmark);
  recipeView.update(model.state.recipe);
  //if we didnt update the bookmark is not exist
  bookmarkView.render(model.state.bookmark);
};
const controlBookmark = function () {
  bookmarkView.render(model.state.bookmark);
};
const controlAddRecipe = async function (newRecipe) {
  // model.state.addRecipe = newRecipe;
  // console.log(model.state.addRecipe);
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);
    //Render 'newRecipe'
    recipeView.render(model.state.recipe); //this is render the recipe we just upload
    //Success msg
    addRecipeView.renderMessage();
    // Render bookmark View
    bookmarkView.render(model.state.bookmark);
    // Change ID in URL
    window.history.pushState(null, '', `${model.state.recipe.id}`); //browser API
    //take 3 parameter first one is 'state' second is 'title' third is 'url'
    // window.history.back() //go back to last page
    // Close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, SUBMIT_FORM_SEC * 1000);
    //re-render Form
  } catch (err) {
    addRecipeView.renderError(err.message);
    console.error(err);
  }
};
const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  //first thing to do is rendering bookmark
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServing(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipe);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerSubmit(controlAddRecipe);
  console.log('welcome');
  //Recipe is not arriving this point so we update 'undefined' now
};
init();
// controlRecipe();
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipe)
// );
// //this the way we implement above two different elements
// // window.addEventListener('hashchange', controlRecipe);
// // window.addEventListener('load', controlRecipe);
// //we want to get the recipe once we load so we use 'load' event as well

//we get the 'data' from 'model' and transfer to 'view' by the 'controller'(MVC)
