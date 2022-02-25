import icons from 'url:../../img/icons.svg';
export default class View {
  // Parent Class
  _data;

  /**
   * Render the received obj to DOM
   * @param {Object | Object[]} data The data to be render (EX:Recipe)
   * @param {Boolean} [render=true] IF false, create markup string instead of render to DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Quee Kao
   * @todo finish implementation
   */
  render(data, render = true) {
    this._data = data;
    if (!data || (Array.isArray(data) && data.length === 0))
      //if no data or data array is empty
      return this.renderError();
    const markup = this._generateMarkup(); //we need to call it
    if (!render) return markup;
    //this method render whatever the data we pass in
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  update(data) {
    // this update Algorithm might not be best solution in the real world App
    this._data = data;
    const newMarkup = this._generateMarkup();
    //compare the new html and old html
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    //this 'newDOM' will create a virtual DOM which live in our computer memory
    const newElement = Array.from(newDOM.querySelectorAll('*')); //we can use this method select all 'el'
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));
    newElement.forEach((newEl, i) => {
      let curEl = curElement[i];
      // Update text
      if (
        !newEl.isEqualNode(curEl) &&
        //this check for if the elments contain text
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //ths firstChild 'node' of elements is 'textNode'
        //so we can use nodeValue to compare(MDN more info)
        //if the nodeValue is elements then will return 'null'
        curEl.textContent = newEl.textContent;
        //this just set the text now we wanna set the attribute
      }
      // Update Attribute
      if (!newEl.isEqualNode(curEl)) {
        // console.log(curEl.closest('[data-update-to]'));
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(
          // we set the all 'newEl' attribute === 'curEl' attribute
          attr => {
            curEl.setAttribute(attr.name, attr.value);
          }
        );
      }
    });
    // console.log(newElement); //all elements
  }
  renderSpinner() {
    //public for controller to fetch the data
    const markup = `
    <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
             <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div> 
              `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
//only use for the parent class
