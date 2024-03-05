import View from './view.js';
import Icons from '../../img/icons.svg';
import * as model from '../model.js';

class PaginationView extends View {
  _parentElement = document.querySelector(`.pagination`);
  _errorMessage = `No recipes found for your query. Please search again ;-) `;
  _message = ``;

  _generateMarkup() {
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    const currentPage = this._data.page;

    let html = ``;
    // if page 1 and there are more pages
    if (numPages > 1 && currentPage === 1) {
      html += this._generateMarkupNextBtn(currentPage);
      return html;
    }
    // if page 1 and there No more pages
    if (numPages === 1) {
      return html;
    }

    // if last page
    if (currentPage === numPages) {
      html += this._generateMarkupBeforeBtn(currentPage);
      return html;
    }
    // On other pages
    if (currentPage >= 1 && currentPage < numPages) {
      html += this._generateMarkupBeforeBtn(currentPage);
      html += this._generateMarkupNextBtn(currentPage);
      return html;
    }
    console.error(`pagination Error___`);
    // return `should have pagination buttons`;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener(`click`, function (e) {
      // e.preventDefault();
      const btnClicked = e.target.closest(`.btn--inline`);
      if (!btnClicked) return;
      const goToPage = btnClicked.dataset.goto;
      handler(goToPage); //this handler is calling the subscribed function in the controller
      // calling controlPaginationClick in : paginationView.addHandlerClick(controlPaginationClick);
    });
  }

  _generateMarkupBeforeBtn(currentPage) {
    return `<button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${Icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currentPage - 1}</span>
  </button>`;
  }
  _generateMarkupNextBtn(currentPage) {
    return ` <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
    <span>Page ${currentPage + 1}</span>
    <svg class="search__icon">
      <use href="${Icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }
}

export default new PaginationView();
