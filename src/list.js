import { LitElement, html, css } from 'lit';
import './category.js';
import './icons/chevron-down.js';
import './icons/chevron-up.js';

export class List extends LitElement {
  static properties = {
    currentWishList: { type: Object },
    categories: { type: Array },
    items: { type: Array },
    isShowingWishList: { type: Boolean, state: true }
  };

  constructor() {
    super();
    this.currentWishList = null;
    this.categories = [];
    this.items = [];
    this.isShowingWishList = true; // default open
  }

  toggleShowWishList() {
    this.isShowingWishList = !this.isShowingWishList;
  }

  get wishListCategories() {
    if (!this.currentWishList || !this.categories) return [];
    const currentWishListId = this.currentWishList.sys?.id;
    return this.categories.filter(category =>
      category.fields.wishList?.some(wishListItem => wishListItem.sys.id === currentWishListId)
    );
  }

  static styles = css`
    .wish-list {
      margin-bottom: 2rem; /* mb-8 */
      padding: 1rem;       /* p-4 */
      border-radius: 0.375rem; /* rounded */
      background-color: #ffffff;
    }

    h2 {
      font-size: 1.875rem; /* text-3xl */
      font-weight: 900;    /* font-black */
      margin-bottom: 0.5rem; /* mb-2 */
    }

    button {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem; /* spacing between text and chevron */
    }

    .is-open {
      display: block;
    }

    .is-closed {
      display: none;
    }
  `;

  render() {
    return html`
      <section class="wish-list">
        <h2>
          <button @click=${this.toggleShowWishList}>
            ${this.currentWishList?.fields?.title}
            ${this.isShowingWishList
              ? html`<chevron-up size="16"></chevron-up>`
              : html`<chevron-down size="16"></chevron-down>`}
          </button>
        </h2>
        <div class=${this.isShowingWishList ? 'is-open' : 'is-closed'}>
          ${this.wishListCategories.map(wishListCategory => html`
            <wish-category
              .currentWishList=${this.currentWishList}
              .currentCategory=${wishListCategory}
              .items=${this.items}>
            </wish-category>
          `)}
        </div>
      </section>
    `;
  }
}

customElements.define('wish-list', List);
