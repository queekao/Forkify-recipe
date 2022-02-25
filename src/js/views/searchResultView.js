import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';
class SearchResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found';
  _message = '';
  _generateMarkup() {
    // console.log(this._data);
    //here we get 'arr' and we want 'string' for insert
    return this._data.map(result => previewView.render(result, false)).join('');
    //this._data from the view //map take the argument that we pass in
  }
  deleteRecipe(data) {
    // const deleteItem = async function (dataItem,recipeID) {
    //   const deleteItem = await fetch(
    //     `https://forkify-api.herokuapp.com/api/v2/recipes/${recipeID}`,
    //     { method: 'DELETE', body: JSON.stringify(dataItem) }
    //   );
    //   return deleteItem
    // };
    this._parentElement.addEventListener('click', function (e) {
      const personIcon = e.target.closest('.preview__user-generated');
      const recipeID = e.target
        .closest('.preview__link')
        .getAttribute('href')
        .slice(1);
      if (!personIcon) return;
      console.log(data);
      const index = data.findIndex(el => el.id === recipeID);
      console.log(index);
      data.splice(index, 1);
      return data;
    });
  }
}
export default new SearchResultView();
