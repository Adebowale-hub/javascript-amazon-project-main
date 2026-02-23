import { cart, removeFromCart, calculateCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js'; 

// Step 1: Create the HTML for the order summary based on the products in the cart
let cartSummaryHTML = '';

cart.forEach((cartItem) => {
    // We get the productId from the cart item
    const productId = cartItem.productId;
    // We find the matching product in the products array using the productId from the cart
    let matchingProduct = products.find(product => product.id === productId);
    // We generate the HTML for each product in the cart
    cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">Delivery date: Tuesday, June 21</div>
            <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}">
                <div class="cart-item-details">
                    <div class="product-name">${matchingProduct.name}</div>
                    <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
                    <div class="product-quantity">
                        <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
                        <span class="update-quantity-link link-primary">Update</span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
                    </div>
                </div>
                <div class="delivery-options">
                    <!-- Delivery options here -->
                </div>
            </div>
        </div>
    `;
});

// We insert the generated HTML into the order summary container in the checkout page
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
// 
document.querySelectorAll('.js-delete-link').forEach((link) => {
    // We add an event listener to each delete link to remove the product from the cart when clicked
    link.addEventListener('click', () => {
        // We get the productId from the data attribute of the clicked link
        const productId = link.dataset.productId;
        // We call the removeFromCart function from the cart.js file to remove the product from the cart
        removeFromCart(productId);
        // We remove the product from the HTML by targeting the cart item container with the matching productId and removing it from the DOM
        document.querySelector(`.js-cart-item-container-${productId}`).remove();
        // We call the calculateCartQuantity function to update the cart quantity in the header after removing the product
        calculateCartQuantity();
    });
});

// Initialize cart quantity on load
calculateCartQuantity();