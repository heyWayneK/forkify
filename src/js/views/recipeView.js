// import icons from '../img/icons.svg'; // Parcel v1 style
// import icons from 'url:../../img/icons.svg'; // Parcel v2 style
import Icons from 'url:../../img/icons.svg'; // Parcel v2 style
const Fraction = require('fractional').Fraction;
// import { Fraction } from 'fractional';
import View from './view';
// console.log(Fraction);

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `We couldn't load the recipe. Please try another one.`;
  _message = ``;

  _data;
  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  _clear = function () {
    this._parentElement.innerHTML = ``;
  };

  renderSpinner() {
    const html = `<div class="spinner">
    <svg>
      <use href="${Icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, html);
  }

  renderError(msg = this._errorMessage) {
    const html = `<div class="error">
      <div>
      <svg>
      <use href="${Icons}#icon-alert-triangle"></use>
      </svg>
      </div>
      <p>${msg}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, html);
  }

  renderMessage(msg) {
    const html = `<div class="message">
      <div>
      <svg>
      <use href="${Icons}#icon-smile"></use>
      </svg>
      </div>
      <p>${msg}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, html);
  }

  // SAME AS
  /**/
  // window.addEventListener(`hashchange`, controlRecipes);
  // window.addEventListener(`load`, controlRecipes);
  // [`hashchange`, `load`].forEach(ev =>
  //     window.addEventListener(ev, controlRecipes)
  //   );

  // PUBLISHER SUBSCRIBER PATTERN
  addHandlerRenderer = function (handler) {
    [`hashchange`, `load`].forEach(ev => window.addEventListener(ev, handler));
  };

  addHandlerUpdateServings = function (handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest(`.btn--update-servings`);
      if (!btn) return;
      let { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  };

  addHandlerBookmark = function (handler) {
    this._parentElement.addEventListener(`click`, function (e) {
      const btn = e.target.closest(`.btn--bookmark`);
      // console.log(btn);
      if (!btn) return;
      handler();
    });
  };

  _generateMarkup() {
    return `<figure class="recipe__fig">
    <img src="${this._data.image}" alt="${this._data.title} " class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
    </figure>
    
    <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${Icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
       <svg class="recipe__info-icon">
        <use href="${Icons}#icon-users"></use>
      </svg>
      <span date-serving="${this._data.servings}" class="recipe__info-data recipe__info-data--people"> ${this._data.servings}</span>
      <span class="recipe__info-text">servings</span>
    
      <div class="recipe__info-buttons">
        <button data-update-to="${this._data.servings - 1}" class="btn--tiny btn--update-servings">
          <svg>
            <use href="${Icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button data-update-to="${this._data.servings + 1}" class="btn--tiny btn--update-servings">
          <svg>
            <use href="${Icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>
    
      <div class="recipe__user-generated ${this._data.key ? `` : `hidden`}">
        <svg>
        <use href="${Icons}#icon-user"></use>
        </svg>
      </div>
    
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${Icons}#icon-bookmark${this._data?.bookmarked ? `-fill` : ``}"></use>
      </svg>
    </button>
    </div>
    
    <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
    <!--
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${Icons}#icon-check"></use>
        </svg>
        <div data-quanity="${`1000`}" class="recipe__quantity">1000</div>
        <div class="recipe__description">
          <span class="recipe__unit">g</span>
          pasta
        </div>
      </li> -->
    ${this._data.ingredients
      .map(e => {
        return `<li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${Icons}#icon-check"></use>
      </svg>
      <div data-quantity="${e.quantity}" class="recipe__quantity">
      ${e.quantity ? new Fraction(e.quantity).toString() : ``}
      </div>
      <div data-unit="${e.unit}"class="recipe__description">
        <span class="recipe__unit">${e.unit}</span>
        ${e.description}
      </div>
    </li>`;
      })
      .join(``)}
    
    </ul>
    </div>
    
    <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${Icons}#icon-arrow-right"></use>
      </svg>
    </a>
    </div>`;
  }
}

// Important to use new??
export default new RecipeView(); // only allows one instance of RecipeView
