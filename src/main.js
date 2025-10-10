import './components/category/category.js';
import './components/claim-item-form/claim-item-form.js';
import './components/claim-item/claim-item.js';
import './components/item/item.js';
import './icons/index.js';
import './components/list/list.js';
import { fetchWishlistData } from './data/data-service.js';

window.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');

  // Fetch wishlist data from all sources
  const { wishlists, categories, items } = await fetchWishlistData();

  // Add wishlists to the page
  wishlists.forEach(wishList => {
    const el = document.createElement('wish-list');
    el.currentWishList = wishList;
    el.categories = categories;
    el.items = items;
    app.appendChild(el);
  });
});

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

