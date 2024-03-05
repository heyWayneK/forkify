import View from './view.js';
import Icons from '../../img/icons.svg';
import PreviewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector(`.results`);
  _errorMessage = `No recipes found for your query. Please search again ;-) `;
  _message = ``;

  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
    // return this._data.map(result => this._generateMarkupPreview(result)).join('');
  }
}

export default new ResultsView();
