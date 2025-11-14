import './components/category/category.js';
import './components/claim-item-form/claim-item-form.js';
import './components/claim-item/claim-item.js';
import './components/item/item.js';
import './icons/index.js';
import './components/list/list.js';
import { fetchAllWishListData } from './lib/wishlist-service.js';

/**
 * Fetches data from Contentful and renders wishlists
 */
async function loadAndRenderWishLists() {
  const app = document.getElementById('app');

  // Show loading state
  app.innerHTML = '<p>Loading wish lists...</p>';

  try {
    // Fetch real data from Contentful
    const { wishLists, categories, items } = await fetchAllWishListData();

    // Clear loading message
    app.innerHTML = '';

    // Add wishlists to the page
    if (wishLists.length === 0) {
      app.innerHTML = '<p>No wish lists found. Please check your Contentful configuration.</p>';
      return;
    }

    wishLists.forEach(wishList => {
      const el = document.createElement('wish-list');
      el.currentWishList = wishList;
      el.categories = categories;
      el.items = items;
      app.appendChild(el);
    });
  } catch (error) {
    console.error('Error loading wish lists:', error);
    app.innerHTML = '<p>Error loading wish lists. Please check the console for details.</p>';
  }
}

// Initial load
window.addEventListener('DOMContentLoaded', loadAndRenderWishLists);

console.log("components registered");

// const wishItemEl = document.createElement('wish-item');
// wishItemEl.currentItem = {
//   fields: {
//     title: 'New Guitar',
//     description: 'Electric guitar',
//     imageUrl: '/guitar.jpg',
//     url: 'https://example.com/guitar'
//   }
// };
// document.body.appendChild(wishItemEl);

