/**
 * Parser for external wishlist HTML sources
 * Extracts item data from HTML and outputs structured JSON
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_FILE = join(__dirname, 'external-source.html');
const OUTPUT_FILE = join(__dirname, 'import-output.json');

/**
 * Extract text content from HTML string
 */
function extractText(html, pattern, group = 1) {
  const match = html.match(pattern);
  return match ? match[group].trim() : null;
}

/**
 * Extract all items from HTML
 */
function parseItems(html) {
  const items = [];

  // Split by item divs - looking for id="item_XXXXX"
  const itemPattern = /<div[^>]+id="item_([^"]+)"[^>]*>([\s\S]*?)(?=<div[^>]+id="item_|$)/g;

  let match;
  while ((match = itemPattern.exec(html)) !== null) {
    const itemId = match[1];
    const itemHtml = match[2];

    try {
      const item = parseItem(itemId, itemHtml);
      if (item) {
        items.push(item);
      }
    } catch (error) {
      console.warn(`Failed to parse item ${itemId}:`, error.message);
    }
  }

  return items;
}

/**
 * Parse a single item's HTML
 */
function parseItem(itemId, html) {
  // Extract ASIN from multiple possible locations
  const asin =
    extractText(html, /data-csa-c-item-id="(\w+)"/) ||
    extractText(html, /\/dp\/(\w+)\//) ||
    null;

  if (!asin) {
    console.warn(`No ASIN found for item ${itemId}`);
    return null;
  }

  // Extract title
  const title =
    extractText(html, /<a[^>]+id="itemName_[^"]+"[^>]+title="([^"]+)"/) ||
    extractText(html, /<a[^>]+id="itemName_[^"]+"[^>]*>([^<]+)<\/a>/) ||
    'Unknown Item';

  // Extract byline (author/brand)
  const byline =
    extractText(html, /<span[^>]+id="item-byline-[^"]+"[^>]*>\s*([^<]+)\s*<\/span>/) ||
    '';

  // Extract image URL
  const imageUrl =
    extractText(html, /<img[^>]+src="(https:\/\/m\.media-amazon\.com\/images\/[^"]+)"/) ||
    null;

  // Extract price
  let price = null;
  const priceMatch = html.match(/<span[^>]+id="itemPrice_[^"]+"[^>]*>[\s\S]*?<span class="a-offscreen">([^<]+)<\/span>/);
  if (priceMatch) {
    price = priceMatch[1].trim();
  }

  // Extract comment/note
  const comment =
    extractText(html, /<span[^>]+id="itemComment_[^"]+"[^>]*>\s*([^<]+)\s*<\/span>/) ||
    '';

  return {
    sys: {
      id: `external-${asin}`
    },
    fields: {
      title: cleanText(title),
      description: byline ? cleanText(byline) : (comment ? cleanText(comment) : ''),
      url: `https://www.amazon.com/dp/${asin}`,
      imageUrl: imageUrl,
      price: price,
      isClaimed: false,
      externalId: asin,
      source: 'external'
    }
  };
}

/**
 * Clean up text by removing extra whitespace and HTML entities
 */
function cleanText(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#034;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('Reading HTML file...');
    const html = readFileSync(INPUT_FILE, 'utf-8');

    console.log('Parsing items...');
    const items = parseItems(html);

    console.log(`\nFound ${items.length} items:`);
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.fields.title}`);
      console.log(`   Price: ${item.fields.price || 'N/A'}`);
      console.log(`   ASIN: ${item.fields.externalId}`);
      console.log(`   Description: ${item.fields.description || 'N/A'}`);
      console.log('');
    });

    console.log(`Writing output to ${OUTPUT_FILE}...`);
    writeFileSync(OUTPUT_FILE, JSON.stringify(items, null, 2));

    console.log('\n✓ Done! Items have been exported to import-output.json');
    console.log('\nNext steps:');
    console.log('1. Review the generated JSON file');
    console.log('2. Import the data into your application');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
