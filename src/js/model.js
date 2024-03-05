import { API_URL, API_SEARCH, API_GET_RECIPE, PAGINATION_RECIPES_PER_PAGE, API_KEY } from './config.js';
import { AJAX } from './helpers.js';
// import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: ``,
    results: [],
    resultsPerPage: PAGINATION_RECIPES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
const _createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }), // only adds Key: recipe.key if it exists. spread operator adds the object
  };
};

export const loadRecipe = async function (id) {
  try {
    // const data = await getJSON(`${API_URL}${id}`);
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = _createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    // console.log(`RECIPE__________`, recipe);
  } catch (error) {
    // pass error up to recipe VIEW
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    console.log(`query:`, query);

    // Reset page to view, start at 1
    state.search.page = 1;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(el => {
      return {
        id: el.id,
        image: el.image_url,
        publisher: el.publisher,
        title: el.title,
        ...(el.key && { key: el.key }),
      };
    });
  } catch (error) {
    // pass error up to recipe VIEW
    throw error;
  }
};

export const getSearchResultsPagination = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  const recipeServingChangeFactor = newServings / state.recipe.servings;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= recipeServingChangeFactor;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  const json = JSON.stringify(state.bookmarks);
  // console.log(json);
  localStorage.setItem(`bookmarks`, json);
};

export const addBookmark = function (bookmark) {
  // Add bookmark
  state.bookmarks.push(bookmark);
  if (bookmark.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem(`bookmarks`);
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear(`bookmarks`);
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(`MODEL: `, newRecipe);
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith(`ingredient`) && entry[1] !== ``)
      .map(ing => {
        const ingArr = ing[1].split(`,`).map(el => el.trim());
        // const ingArr = ing[1].replaceAll(` `, ``).split(`,`);

        // get the ingredients and remove spaces and destructure
        if (ingArr.length !== 3) {
          throw new Error(`Ingredient: ${ing[0]} does not have Quantity, Unit & Description`);
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(ingredients);
    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      ...(newRecipe.key && { key: newRecipe.key }),
    };
    const url = `${API_URL}?key=${API_KEY}&`;

    // const data = await sendJSON(url, recipe);
    const data = await AJAX(url, recipe);
    state.recipe = _createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
