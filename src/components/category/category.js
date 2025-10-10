import { LitElement, html } from 'lit';
import '../item/item.js';
import '../../icons/chevron-down.js';
import '../../icons/chevron-up.js';
import styles from './category.css?inline';

export class Category extends LitElement {
  static properties = {
    currentWishList: { type: Object },
    currentCategory: { type: Object },
    items: { type: Array },
    isShowingCategory: { type: Boolean, state: true }
  };

  constructor() {
    super();
    this.currentWishList = null;
    this.currentCategory = null;
    this.items = [];
    this.isShowingCategory = true; // default open
  }

  static styles = new CSSStyleSheet();

  connectedCallback() {
    super.connectedCallback();
    if (!Category.styles.cssRules.length) {
      Category.styles.replaceSync(styles);
    }
    this.shadowRoot.adoptedStyleSheets = [Category.styles];
  }

  toggleShowCategory() {
    this.isShowingCategory = !this.isShowingCategory;
  }

  get sortedCategoryItems() {
    if (!this.currentCategory || !this.currentWishList || !this.items) return [];

    const currentWishListId = this.currentWishList.sys?.id;
    const currentCategoryId = this.currentCategory.sys?.id;

    const categoryItems = this.items.filter(item =>
      item.fields.category?.some(category => category.sys.id === currentCategoryId) &&
      item.fields.wishList.some(wishList => wishList.sys.id === currentWishListId) &&
      !item.fields.isStale
    );

    return categoryItems.sort((a, b) => {
      if (a.fields.isClaimed && !b.fields.isClaimed) return 1;
      if (!a.fields.isClaimed && b.fields.isClaimed) return -1;
      return a.fields.title?.toLowerCase().localeCompare(b.fields.title?.toLowerCase());
    });
  }

  render() {
    return html`
      <h3>
        <button @click=${this.toggleShowCategory}>
          ${this.currentCategory?.fields?.title}
          ${this.isShowingCategory
            ? html`<chevron-up size="12"></chevron-up>`
            : html`<chevron-down size="12"></chevron-down>`}
        </button>
      </h3>
      <ul class=${this.isShowingCategory ? 'is-open' : 'is-closed'}>
        ${this.sortedCategoryItems.map(categoryItem => html`
          <wish-item .currentItem=${categoryItem}></wish-item>
        `)}
      </ul>
    `;
  }
}

customElements.define('wish-category', Category);
