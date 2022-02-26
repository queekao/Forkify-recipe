// import icons from '../img/icons.svg' //Parcel 1
import icons from 'url:../../img/icons.svg'; //Parcel 2
import View from './view';
import { Fraction } from 'fractional';
import { numberToFraction } from '../helper';
console.log(Fraction);
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'we could not find that recipe. Please try another one!';
  _message = '';
  //PUBLISHER-SUBSCRIBER PATTERN(here is publisher and controller is subscriber)
  addHandlerRender(handler) {
    //this handler fn and event from the subscriber(controller)
    //Presentation Logic should appear in the view
    //we cant call the event from here to controller because we dont have access to it
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    //this the way we implement above two different elements
    // window.addEventListener('hashchange', controlRecipe);
    // window.addEventListener('load', controlRecipe);
    //we want to get the recipe once we load so we use 'load' event as well
  }
  addHandlerServing(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btnServing = e.target.closest('.btn--tiny');
      const servingData = document.querySelector(
        '.recipe__info-data--people'
      ).innerHTML;
      if (!btnServing) return;
      //My solution
      // if (
      //   btnServing.classList.contains('btn--decrease-servings') &&
      //   servingData > 1
      // ) {
      //   handler(+servingData - 1);
      // }
      // if (btnServing.classList.contains('btn--increase-servings')) {
      //   handler(+servingData + 1);
      // }
      //Jonas Solution
      const { updateTo } = btnServing.dataset;
      if (+updateTo > 0) handler(+updateTo);
      // console.log(btnServing);
    });
  }
  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btnBookmark = e.target.closest('.btn--bookmark');
      if (!btnBookmark) return;
      handler();
    });
  }
  // addHandlerDeleteRecipe(handler) {
  //   this._parentElement.addEventListener('click', function (e) {
  //     const personIcon = e.target.closest('.recipe__user-generated');
  //     if (!personIcon) return;
  //     handler();
  //   });
  // }
  _generateMarkup() {
    // console.log(this._data);
    // console.log(this._data);
    return `
        <figure class="recipe__fig">
        <img src="${
          this._data.image
        }" crossOrigin="anonymous" alt="Tomato" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>
      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">45</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>
    
          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--decrease-servings" data-update-to=${
              this._data.servings - 1
            }>
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings" data-update-to=${
              this._data.servings + 1
            }>
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>
    
      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
        </ul>
      </div>
    
      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
       `; //this fn just capable for return the html string
  }
  _generateMarkupIngredient(ing) {
    return `
        <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${
            ing.quantity ? numberToFraction(ing.quantity).toString() : 0
          }</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
          </div>
        </li>
        `;
  }
}

export default new RecipeView();
//we can directly export a new obj to 'controller'
//export default mean handle export live bindings to functions,
//Import default dont need .js
