// PUBLISHER SUBSCRIBER PATTERN

// PUBLISHER
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// VIEWER FILE
class View {
  #parentElement = document.querySelector('.search');

  #clearInput() {
    this.#parentElement.querySelector(`.search__field`).value = ``;
  }

  // PUBLISHER SUBSCRIBER PATTERN
  // this is the publisher, the subscriber is in the controller
  addHandlerSearch(handler) {
    this.#parentElement.addEventListener(`submit`, function (e) {
      e.preventDefault();
      handler();
    });
  }
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// CONTROLLER FILE
// This is the subscriber, the publisher is in the View
const controlSearchResults = async function () {
  try {
    // 1) get search query from html
    const query = searchView.getQuery();
    if (!query) return;

    // 2) get search results from API
    await model.loadSearchResults(query);

    // 3) render results
    console.log(model.state.search.results);
    // render
  } catch (error) {
    throw error;
  }
};

// LINK 1. VIEW  2. ADD HANDLER FROM VIEW   3. PASS VIEWTHE CONTROLLER METHOD/FUNCTION
const init = function () {
  searchView.addHandlerSearch(controlSearchResults);
};
init();
