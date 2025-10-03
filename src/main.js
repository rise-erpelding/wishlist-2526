import './index.css';

import './my-element.js';
import './category.js';
import './claim-item-form.js';
import './claim-item.js';
import './item.js';
import './icons/index.js';

// window.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('test-form');
//   if (form) {
//     form.handleShowClaimed = () => alert('Item claimed!');
//     form.handleCloseForm = () => alert('Form closed!');
//   }
// });

console.log("components registered");

const wishItemEl = document.createElement('wish-item');
wishItemEl.currentItem = {
  fields: {
    title: 'New Guitar',
    description: 'Electric guitar',
    imageUrl: '/guitar.jpg',
    url: 'https://example.com/guitar'
  }
};
document.body.appendChild(wishItemEl);

