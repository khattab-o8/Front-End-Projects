import View from './view.js';
import icons from 'url:../../img/icons.svg'; // parcel2

export default class PreviewView extends View {
  _data;

  _generateMarkup() {
    // return this._data.map(this._generateMarkupPreview).join('');
    return this._data.map(res => this._generateMarkupPreview(res)).join('');
  }

  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);
    return `
      <li class="preview">
        <a class="preview__link ${
          result.id === id ? 'preview__link--active' : ''
        }" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}s" />
          </figure>
          <div class="preview__data">

            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            <div class="preview__user-generated ${result.key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>

          </div>
        </a>
      </li>
    `;
  }
}
