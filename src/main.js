import './components/category/category.js';
import './components/claim-item-form/claim-item-form.js';
import './components/claim-item/claim-item.js';
import './components/item/item.js';
import './icons/index.js';
import './components/list/list.js';
import { mockWishLists, mockCategories, mockItems } from './mock-data.js';

window.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  // Add both wishlists to the page
  mockWishLists.forEach(wishList => {
    const el = document.createElement('wish-list');
    el.currentWishList = wishList;
    el.categories = mockCategories;
    el.items = mockItems;
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

