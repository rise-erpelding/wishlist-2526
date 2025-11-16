import { LitElement, html } from 'lit';
import '../category/category.js';
import '../../icons/chevron-down.js';
import '../../icons/chevron-up.js';
import styles from './list.css?inline';

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

  static styles = new CSSStyleSheet();

  connectedCallback() {
    super.connectedCallback();
    if (!List.styles.cssRules.length) {
      List.styles.replaceSync(styles);
    }
    this.shadowRoot.adoptedStyleSheets = [List.styles];
  }

  toggleShowWishList() {
    this.isShowingWishList = !this.isShowingWishList;
  }

  get wishListCategories() {
    if (!this.currentWishList || !this.categories) return [];
    const currentWishListId = this.currentWishList.sys?.id;

    // Only show categories that are linked to this wishlist AND have items
    return this.categories.filter(category => {
      const isLinkedToWishList = category.fields.wishList?.some(
        wishListItem => wishListItem.sys.id === currentWishListId
      );

      if (!isLinkedToWishList) return false;

      // Check if this category has any items in this wishlist
      const categoryId = category.sys?.id;
      const hasItems = this.items.some(item =>
        item.fields.category?.some(cat => cat.sys.id === categoryId) &&
        item.fields.wishList.some(wl => wl.sys.id === currentWishListId) &&
        !item.fields.isStale
      );

      return hasItems;
    });
  }

  render() {
    return html`
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
    `;
  }
}

customElements.define('wish-list', List);
