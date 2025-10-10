# Scripts

Utility scripts for importing wishlist data from external sources.

## Import from HTML

Parse HTML from external wishlist sources.

### Usage:

1. **Get the HTML:**
   - Open the external wishlist in your browser
   - Open browser console (F12)
   - Run: `copy(document.documentElement.outerHTML)`
   - Paste into `scripts/external-source.html`

2. **Run the parser:**
   ```bash
   node scripts/parse-external-items.js
   ```

3. **Review the output:**
   - Check `scripts/import-output.json` for the extracted items
   - Verify titles, prices, images, etc. look correct

4. **Import into your app:**
   - Use the generated JSON to add items to your wishlist data
