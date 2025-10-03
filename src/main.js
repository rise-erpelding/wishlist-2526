import './index.css';

import './my-element.js';
import './category.js';
import './claim-item-form.js';
import './claim-item.js';
import './item.js';
import './icons/index.js';
import './list.js';
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

