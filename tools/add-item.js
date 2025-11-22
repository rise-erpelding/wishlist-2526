import readline from 'readline';
import { JSDOM } from 'jsdom';
import {
  findOrCreateWishlist,
  findOrCreateCategory,
  createOrUpdateItem,
} from '../scripts/parsers/contentful.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Fetch a URL and extract the best image from the page
 */
async function extractImageFromUrl(url) {
  try {
    console.log('   Fetching page to extract image...');

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      console.log(`   Warning: Could not fetch URL (${response.status})`);
      return '';
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Try various common image meta tags and selectors
    const imageSelectors = [
      // Open Graph
      'meta[property="og:image"]',
      'meta[property="og:image:secure_url"]',
      // Twitter
      'meta[name="twitter:image"]',
      'meta[name="twitter:image:src"]',
      // Amazon specific
      '#landingImage',
      '#imgBlkFront',
      '.a-dynamic-image',
      // Target specific
      'img[data-test="product-image"]',
      // Generic product images
      '[data-main-image]',
      '.product-image img',
      '.primary-image',
    ];

    for (const selector of imageSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        // Check if it's a meta tag or img element
        const imageUrl = element.getAttribute('content') ||
                        element.getAttribute('src') ||
                        element.getAttribute('data-src');
        if (imageUrl && imageUrl.startsWith('http')) {
          console.log(`   ✓ Found image from ${selector}`);
          return imageUrl;
        }
      }
    }

    console.log('   Warning: Could not find image on page');
    return '';
  } catch (error) {
    console.log(`   Warning: Error fetching URL - ${error.message}`);
    return '';
  }
}

/**
 * Get list of existing wishlists for selection
 */
async function getWishlistOptions() {
  // Common wishlist names - you can customize this
  return ['David', 'James', 'Both kids', 'Rise', 'Mark'];
}

/**
 * Get list of existing categories for selection
 */
async function getCategoryOptions() {
  // Common category names - you can customize this
  return ['items', 'books', 'gift cards', 'experiences'];
}

async function main() {
  console.log('\n📦 Add Item to Wishlist\n');
  console.log('Enter item details (press Ctrl+C to cancel)\n');

  try {
    // 1. URL first
    const url = await question('URL: ');
    if (!url) {
      console.log('URL is required');
      rl.close();
      return;
    }

    // Try to extract image from URL
    let imageUrl = await extractImageFromUrl(url);

    // 2. Title
    const title = await question('Title: ');
    if (!title) {
      console.log('Title is required');
      rl.close();
      return;
    }

    // 3. Description (optional)
    const description = await question('Description (optional): ');

    // 4. Wishlist selection
    const wishlistOptions = await getWishlistOptions();
    console.log('\nWishlist options:');
    wishlistOptions.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));
    const wishlistInput = await question('Wishlist (number or name): ');

    let wishlistName;
    const wishlistNum = parseInt(wishlistInput);
    if (!isNaN(wishlistNum) && wishlistNum > 0 && wishlistNum <= wishlistOptions.length) {
      wishlistName = wishlistOptions[wishlistNum - 1];
    } else {
      wishlistName = wishlistInput;
    }

    // 5. Category selection
    const categoryOptions = await getCategoryOptions();
    console.log('\nCategory options:');
    categoryOptions.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));
    const categoryInput = await question('Category (number or name): ');

    let categoryName;
    const categoryNum = parseInt(categoryInput);
    if (!isNaN(categoryNum) && categoryNum > 0 && categoryNum <= categoryOptions.length) {
      categoryName = categoryOptions[categoryNum - 1];
    } else {
      categoryName = categoryInput;
    }

    // 6. Confirm or override image URL
    if (imageUrl) {
      console.log(`\nExtracted image: ${imageUrl.substring(0, 80)}...`);
      const overrideImage = await question('Use this image? (Y/n or enter new URL): ');
      if (overrideImage.toLowerCase() === 'n') {
        imageUrl = '';
      } else if (overrideImage && overrideImage.toLowerCase() !== 'y') {
        imageUrl = overrideImage;
      }
    } else {
      imageUrl = await question('Image URL (optional): ');
    }

    // Confirm
    console.log('\n--- Item Summary ---');
    console.log(`Title: ${title}`);
    console.log(`URL: ${url}`);
    console.log(`Description: ${description || '(none)'}`);
    console.log(`Wishlist: ${wishlistName}`);
    console.log(`Category: ${categoryName}`);
    console.log(`Image: ${imageUrl ? imageUrl.substring(0, 50) + '...' : '(none)'}`);

    const confirm = await question('\nCreate this item? (Y/n): ');
    if (confirm.toLowerCase() === 'n') {
      console.log('Cancelled');
      rl.close();
      return;
    }

    // Create the item
    console.log('\nCreating item...\n');

    const wishlist = await findOrCreateWishlist(wishlistName);
    const category = await findOrCreateCategory(categoryName, wishlist);

    await createOrUpdateItem(
      {
        title,
        description,
        imageUrl,
        url,
      },
      wishlist,
      category
    );

    console.log('\n✅ Item added successfully!\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
