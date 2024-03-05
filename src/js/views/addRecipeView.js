import View from './view';
import Icons from '../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = `Recipe was successfully uploaded`;
  _window = document.querySelector(`.add-recipe-window`);
  _overlay = document.querySelector(`.overlay`);
  _btnOpen = document.querySelector(`.nav__btn--add-recipe`);
  _btnClose = document.querySelector(`.btn--close-modal`);
  _errorMessage = ``;
  //   _btnUpload = document.querySelector(`.upload__btn`);
  _generateMarkup() {}

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow = function () {
    // this is the class object with functions and all.
    this._overlay.classList.toggle(`hidden`);
    this._window.classList.toggle(`hidden`);
  };

  _addHandlerShowWindow = function () {
    this._btnOpen.addEventListener(`click`, this.toggleWindow.bind(this));
  };

  _addHandlerHideWindow = function () {
    this._btnClose.addEventListener(`click`, this.toggleWindow.bind(this));
    this._overlay.addEventListener(`click`, this.toggleWindow.bind(this));
  };

  _addHandlerUpload = function (handler) {
    this._parentElement.addEventListener(`submit`, function (e) {
      e.preventDefault();
      // "THIS" on an html object returns the html
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  };
}

export default new AddRecipeView();
