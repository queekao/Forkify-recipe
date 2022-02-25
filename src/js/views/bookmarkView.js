import View from './View';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmark found';
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    // console.log(this._data);
    return (
      this._data
        .map(bookmark => previewView.render(bookmark, false))
        // we end up with a string
        .join('')
    );
    //we dont directly pass in the _data because we still have to set this_data = data
  }
  //   _generateMarkupPreview(res) {
  //     //res equal the obj we pass in and if we click the window id change
  //     // we check if the res.id is the same in URL and we wanna add 'preview__link--active'
  //     const id = window.location.hash.slice(1);
  //     return `
  //         <li class="preview">
  //         <a class="preview__link ${
  //           id === res.id ? 'preview__link--active' : ''
  //         }" href="#${res.id}">
  //           <figure class="preview__fig">
  //             <img src="${res.image}" crossOrigin="anonymous" alt="${
  //       res.title
  //     }" />
  //           </figure>
  //           <div class="preview__data">
  //             <h4 class="preview__title">${res.title}</h4>
  //             <p class="preview__publisher">${res.publisher}</p>
  //           </div>
  //         </a>
  //       </li>
  //           `;
  //   }
}
export default new BookmarkView();
