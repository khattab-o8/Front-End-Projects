import View from './view.js';
import icons from 'url:../../img/icons.svg'; // parcel2

class PginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateNextBtn(currPage) {
    return `
      <button data-goto = "${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }

  _generatePrevBtn(currPage) {
    return `
      <button data-goto ="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
      </button>
    `;
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    //-------------------------------//
    // Page 1 and there're other pages ⏩️
    if (currentPage === 1 && numPages > currentPage)
      return this._generateNextBtn(currentPage);

    //-------------------------------//
    // Last page ⏪️
    if (currentPage === numPages && numPages > 1)
      return this._generatePrevBtn(currentPage);

    //-------------------------------//
    // Other page ⏪️⏩️
    if (currentPage > 1 && currentPage < numPages)
      return `
        ${this._generatePrevBtn(currentPage)}
        ${this._generateNextBtn(currentPage)}
      `;

    //-------------------------------//
    // Only one single page
    if (numPages <= 1) return '';
  }

  addHandlerClick(handler) {
    // Event delegation
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return; // Gaurd clause

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PginationView();
