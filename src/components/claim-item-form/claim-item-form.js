import { LitElement, html } from 'lit';
import { patchEntry } from '../../lib/contentful.js';
import styles from './claim-item-form.css?inline';

export class ClaimItemForm extends LitElement {
  static properties = {
    itemId: { type: String },          // maps `itemId` attribute
    handleShowClaimed: { type: Function },
    handleCloseForm: { type: Function }
  };

  constructor() {
    super();
    this.itemId = '';
    this.handleShowClaimed = () => {};
    this.handleCloseForm = () => {};
  }

  static styles = new CSSStyleSheet();

  connectedCallback() {
    super.connectedCallback();
    if (!ClaimItemForm.styles.cssRules.length) {
      ClaimItemForm.styles.replaceSync(styles);
    }
    this.shadowRoot.adoptedStyleSheets = [ClaimItemForm.styles];
  }

  handleInputChange(e) {
    this.emailAddress = e.target.value;
  }

  async handleClaimWithoutEmail(e) {
    e.preventDefault();
    console.log("handling claim without email");
    try {
      await patchEntry(this.itemId, { isClaimed: true, claimedBy: '' });
      if (this.handleShowClaimed) this.handleShowClaimed();
      // Trigger a page reload to show updated data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Failed to claim item:', error);
    }
  }

  async handleClaimWithEmail(e) {
    e.preventDefault();
    console.log("handling claim with email:", this.emailAddress);
    try {
      await patchEntry(this.itemId, { isClaimed: true, claimedBy: this.emailAddress || '' });
      if (this.handleShowClaimed) this.handleShowClaimed();
      // Trigger a page reload to show updated data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Failed to claim item:', error);
    }
  }

  render() {
    return html`
      <div class="claim-item-form">
        <div style="display: flex; flex-direction: row-reverse;">
          <button @click=${this.handleCloseForm}>
            <close-button size="16"></close-button>
          </button>
        </div>
        <form>
          <label for="email">Email</label>
          <input
            id="email"
            class="email-input"
            type="email"
            .value=${this.emailAddress}
            @input=${this.handleInputChange}
          />
          <p class="subtext">Only visible to list owner</p>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button
              class="button button-secondary"
              @click=${this.handleClaimWithoutEmail}
            >
              Claim without email
            </button>
            <button
              class="button button-primary"
              @click=${this.handleClaimWithEmail}
            >
              Claim item
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('wish-claim-item-form', ClaimItemForm);
