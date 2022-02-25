import icons from 'url:../../img/icons.svg';
import View from './View';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerPagination(handler) {
    //use event delegation
    this._parentElement.addEventListener('click', function (ev) {
      const btn = ev.target.closest('.btn--inline');
      if (!btn) return;
      //   console.log(btn);
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    //To know how many pages we need the 'searchRecipe' obj here
    const numPage = Math.ceil(this._data.results.length / this._data.perPage);
    const curPage = this._data.page;
    //To know which page we are on right now we add 'Attribute' to the btn
    const btnNextPage = `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
  `;
    const btnPrePage = `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    `;
    // console.log(numPage);
    //Page 1 and there are other pages
    if (curPage === 1 && numPage > 1) {
      return btnNextPage;
    }
    //Page 1 and there No other pages
    if (curPage === 1 && numPage === 1) {
      return ``;
    }
    //Last page
    if (curPage === numPage && numPage > 1) {
      return btnPrePage;
    }
    //Other page
    if (curPage < numPage) {
      return `
        ${btnPrePage}
        ${btnNextPage}
      `;
    }
  }
}
export default new PaginationView();
