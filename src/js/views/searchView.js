class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector(`.search__field`).value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector(`.search__field`).value = ``;
  }

  // PUBLISHER SUBSCRIBER PATTERN
  // this is the publisher, the subscriber is in the controller
  addHandlerSearch(handler) {
    this._parentElement.addEventListener(`submit`, function (e) {
      e.preventDefault();
      handler();
    });
  }
}

// Essential for the NEW
export default new SearchView();
