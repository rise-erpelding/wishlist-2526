import { LitElement, html } from 'lit';
import { patchEntry } from '../../lib/contentful.js';
import '../claim-item-form/claim-item-form.js';
import styles from './claim-item.css?inline';

export class ClaimItem extends LitElement {
  static properties = {
    currentItem: { type: Object },
    showForm: { type: Boolean },
    showClaimed: { type: Boolean },
    existingClaimedStatus: { type: Boolean },
    itemId: { type: String },
  };

  constructor() {
    super();
    this.showForm = false;
    this.showClaimed = false;
    this.existingClaimedStatus = false;
    this.itemId = '';
    this.currentItem = null;
  }

  static styles = new CSSStyleSheet();

  connectedCallback() {
    super.connectedCallback();
    if (!ClaimItem.styles.cssRules.length) {
      ClaimItem.styles.replaceSync(styles);
    }
    this.shadowRoot.adoptedStyleSheets = [ClaimItem.styles];
  }

  firstUpdated() {
    if (this.currentItem) {
      this.existingClaimedStatus = this.currentItem.fields.isClaimed;
      this.itemId = this.currentItem.sys.id;
      this.showClaimed = this.existingClaimedStatus;
    }
  }

  handleClaim() {
    this.showForm = true;
    this.dispatchEvent(new CustomEvent('form-state-change', {
      detail: { hasForm: true },
      bubbles: true,
      composed: true
    }));
  }

  handleCloseForm = () => {
    this.showForm = false;
    this.dispatchEvent(new CustomEvent('form-state-change', {
      detail: { hasForm: false },
      bubbles: true,
      composed: true
    }));
  };

  handleShowClaimed = () => {
    this.showClaimed = true;
    this.showForm = false;
    this.dispatchEvent(new CustomEvent('form-state-change', {
      detail: { hasForm: false },
      bubbles: true,
      composed: true
    }));
  };

  async handleUnclaim(e) {
    e.preventDefault();
    try {
      await patchEntry(this.itemId, { isClaimed: false, claimedBy: '' });
      console.log("handling unclaim for item:", this.itemId);
      this.showClaimed = false;
      this.existingClaimedStatus = false;
      // Trigger a page reload to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Failed to unclaim the item:', error);
    }
  }

  render() {
    return html`
      ${this.existingClaimedStatus && !this.showForm
        ? html`<h5>Already claimed</h5>`
        : null}

      ${!this.showForm && !this.showClaimed
        ? html`
            <div class="dialog claim-dialog">
              <h5 class="claim-prompt">Planning to buy this? Claim it!</h5>
              <button class="button button-primary" @click=${this.handleClaim}>
                Claim
              </button>
            </div>
          `
        : null}

      ${this.showForm
        ? html`
            <wish-claim-item-form
              .itemId=${this.itemId}
              .handleShowClaimed=${this.handleShowClaimed}
              .handleCloseForm=${this.handleCloseForm}
            ></wish-claim-item-form>
          `
        : null}

      ${!this.existingClaimedStatus && this.showClaimed && !this.showForm
        ? html`
            <div class="dialog">
              <p class="claimed-text">Claimed!</p>
              <div class="undo-wrapper">
                <p class="subtext">Need to undo?</p>
                <button
                  class="button button-secondary"
                  @click=${this.handleUnclaim}
                >
                  Undo?
                </button>
              </div>
            </div>
          `
        : null}
    `;
  }
}

customElements.define('wish-claim-item', ClaimItem);
