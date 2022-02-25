import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX, sendJSON } from './helper';
export const state = {
  recipe: [], //we keep it empty in order to put the data inside of it
  //and basically recipe will only have one data while the recipe data arrive
  searchRecipe: {
    query: '',
    results: [],
    perPage: RES_PER_PAGE,
    page: 1, //page change and the btn will change
  },
  bookmark: [],
  // addRecipe: [],
};
// this is not a pure fn because it hold 'state' of 'side effect'
//get recipes
const createRecipe = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    //if the key exist we wanna return key obj with seperate operator
  };
};
export const loadRecipe = async function (id) {
  //This fn will be responsible for fetching the data from Forkify API
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // const response = await fetch(
    //   // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40'
    //   `${API_URL}/${id}`
    // );
    // const data = await response.json();
    // if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    // console.log(data);
    // const { recipe } = data.data;
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };
    state.recipe = createRecipe(data);
    // state.bookmark.filter(recipe => {
    //   return state.recipe !== recipe.id;
    // });
    if (state.bookmark.some(b => b.id === id)) {
      state.recipe.bookmarked = true; //the bookmark fill is control by 'bookmarked'
    } else {
      state.recipe.bookmarked = false;
    }
    // console.log(state.recipe);
  } catch (err) {
    // console.error(`${err}`);
    throw err;
    //throw the Error to the controller
  }
};
//get all recipes
export const loadSearchResult = async function (query) {
  try {
    state.searchRecipe.query = query;
    //this query is for 'string' which we will search for
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    //already have search so we add '&' for key
    const recipes = data.data.recipes;
    state.searchRecipe.results = recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    }); //store in the state as well
    state.searchRecipe.page = 1; //reload page and page to 1
    // console.log(state.searchRecipe.results);
  } catch (err) {
    throw err;
  }
};
export const resultPerPage = function (page = state.searchRecipe.page) {
  state.searchRecipe.page = page;
  //the page stand for which page I am right now
  const start = (page - 1) * state.searchRecipe.perPage; // (2- 1) * 12
  const end = page * state.searchRecipe.perPage; // (2) * 12
  // console.log(start, end);
  return state.searchRecipe.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // console.log(ing);
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  }); // newQt = oldQt * newServings / oldServings
  //Update the newServing(or it will be old servings for updating)
  state.recipe.servings = newServings;
};
const storeBookmark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};
export const updateBookmark = function (recipe) {
  // 1) Push recipe to bookmark
  state.bookmark.push(recipe);
  // 2) Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
    storeBookmark();
  }
  //if we load the searchResult then the bookmark will be reset because
  //it come from API not the bookmark arr
};
export const deleteBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id); //curID equal delete id
  // state.bookmark.filter(bookmark => id !== bookmark.id);
  state.bookmark.splice(index, 1); //second 'argument' is the amount of delete El
  // if (state.recipe?.key ?? true) state.searchRecipe.results.splice(index, 1);
  //Mark current recipe NOT as bookmark
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
    storeBookmark();
  }
};
const initBookmark = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) return (state.bookmark = JSON.parse(storage));
};
export const uploadRecipe = async function (newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    //filter find the ingredient
    .map(ing => {
      const ingArr = ing[1].map(el => el.trim());
      // console.log(ingArr);
      if (ingArr.length !== 3) throw new Error('Wrong ingredient format');
      //we catch this error in our 'controller'
      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });
  // console.log(ingredients);
  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients: ingredients,
  }; //this newly return obj 'name' need to be like the recipe data we loaded
  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = createRecipe(data);
  updateBookmark(state.recipe);
};
export const deleteSearchRecipe = async function (id) {
  const index = state.searchRecipe.results.findIndex(el => el.id === id);
  // state.searchRecipe.results.splice(index, 1);
};
const clearBookmark = function () {
  localStorage.clear('bookmark');
};
// clearBookmark(); //this clear method need to call before store bookmark
initBookmark();
console.log(state.bookmark);
