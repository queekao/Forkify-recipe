import View from './View';
class SearchView {
  //this class only for getting the 'query' and click event
  _parentElement = document.querySelector('.search');
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    //first we get the query and clear it and return the query
    this._clearInput();
    return query;
  }
  _clearInput() {
    document.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
