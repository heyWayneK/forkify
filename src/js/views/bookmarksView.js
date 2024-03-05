import View from './view.js';
import Icons from '../../img/icons.svg';
import PreviewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector(`.bookmarks__list`);
  _errorMessage = `No bookmarks founds. Find a good recipe and bookmark it ;-) `;
  _message = ``;

  _generateMarkup() {
    return this._data.map(bookmark => PreviewView.render(bookmark, false)).join('');
    // return this._data.map(result => this._generateMarkupPreview(result)).join('');
  }

  addHandlerRender(handler) {
    window.addEventListener(`load`, handler);
  }
}

export default new BookmarksView();
