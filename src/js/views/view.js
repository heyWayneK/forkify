// import Icons from 'url:../../img/icons.svg'; // Parcel v2 style
import Icons from '../../img/icons.svg'; // Parcel v2 style

export default class View {
  _parentElement = ``; // document.querySelector('.recipe');
  _errorMessage = ``; //`We couldn't load the recipe. Please try another one.`;
  _message = ``;
  _data;

  //////////

  /**
   * Renders the recieved object (an HTML) to the DOM
   * @param {Array | Array []} data The data to be rendered eg a Recipe
   * @param {Boolean} [render = true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A html markup is returned if render = false
   * @this {Object} View instance
   * @author Wayne Kaminsky
   * @todo Finish Implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  _clear = function () {
    this._parentElement.innerHTML = ``;
  };

  //////////

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    // console.log(`data to render`, this._data);
    const updatedMarkup = this._generateMarkup();

    // Create a Virtual DOM from the HTML
    const newDOM = document.createRange().createContextualFragment(updatedMarkup);
    // Query Selector All returns NODELIST, NOT an ARRAY... convert to array Array.from()
    const newElements = Array.from(newDOM.querySelectorAll(`*`));
    const oldElements = Array.from(this._parentElement.querySelectorAll(`*`));
    newElements.forEach((newEl, i) => {
      const oldEl = oldElements[i];
      // console.log(!newEl.isEqualNode(oldEl) ? `💥` : ``, oldEl, newEl.isEqualNode(oldEl));

      // 1) Only updates TEXT (textContent) between new and old DOM
      // console.log(`💥`, newEl);
      if (!newEl.isEqualNode(oldEl) && newEl?.firstChild?.nodeValue.trim() !== ``) {
        oldEl.textContent = newEl.textContent;
        // console.log(`😁`, newEl.firstChild.nodeValue.trim());
      }

      // 2) Only updates ATTRIBUTES between new and old DOM
      // WAYNE FOR FUTURE...
      // ... maybe only find data attributes with 'Update' e.f. data-update-serving ="2"; // updateServing.??
      if (!newEl.isEqualNode(oldEl)) {
        // console.log(`attributes`, newEl.attributes);
        Array.from(newEl.attributes).forEach((attr, i) => {
          // console.log(`Attribute from : to :`, attr.name, oldEl.attributes[i].value, attr.value);
          oldEl.setAttribute(attr.name, attr.value);
        });
      }
    });
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
    const html = `
      <div class="error">
            <div>
              <svg>
                <use href="${Icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>
    
  <div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, html);
  }

  renderMessage(msg = this._message) {
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

  _generateMarkup() {}
}
