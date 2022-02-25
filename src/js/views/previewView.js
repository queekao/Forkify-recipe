import View from './View';
import icons from 'url:../../img/icons.svg';
class PreviewView extends View {
  _parentElement = document.querySelector('.results');
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return `
        <li class="preview">
        <a class="preview__link ${
          id === this._data.id ? 'preview__link--active' : ''
        }" href="#${this._data.id}">
          <figure class="preview__fig">
            <img src="${this._data.image}" crossOrigin="anonymous" alt="${
      this._data.title
    }" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
            <div class="preview__user-generated ${
              this._data.key ? '' : 'hidden'
            }">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
            <div class="preview__user-generated ${
              this._data.key ? '' : 'hidden'
            }">
            <svg>
              <use href="${icons}#icon-edit"></use>
             </svg>
            </div>
          </div>
        </a>
      </li>
          `;
  }
  //we use previewView with this._data because we call render method in the bookmark
  //and the render method will pass data here in and we still need to set this._data = data
}
export default new PreviewView();
