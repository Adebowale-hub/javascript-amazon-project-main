// Don't forget the Main Idea of JavaScript
// 1. Save the data
// 2. Generate the HTML
// 3. Make it interactive

// Checkout Page Step 2: Generate the HTML
import {cart, removeFromCart} from '../data/cart.js';
import {products} from '../data/products.js';
import { formatCurrency } from './utils/money.js'; 

// After combining the HTML together, 
// let's create a variable appear to store the result
let cartSummaryHTML = '';

// Checkout Page Step 3: Loop throw the cart and generate the HTML
// Search for the array for the full products details
cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    
    // Create a variable to save the result
    let matchingProduct;

    // Loop throw the products array, duplicate and normalize the data 
    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });

    // console.log(matchingProduct); 

    // Store the generated HTML into the variable to appear (use of the accumulation pattern '+=')
    cartSummaryHTML += `
        <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image} ">

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity} </span>
                    </span>
                    <span class="update-quantity-link link-primary">
                    Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                <div class="delivery-option">
                    <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            Tuesday, June 21 
                        </div>
                        <div class="delivery-option-price">
                            FREE Shipping
                        </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            Wednesday, June 15
                        </div>
                        <div class="delivery-option-price">
                            $4.99 - Shipping
                        </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            Monday, June 13
                        </div>
                        <div class="delivery-option-price">
                            $9.99 - Shipping
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    `;
});

console.log(cart);

//  console.log(cartSummaryHTML);

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            // console.log('delete');
            const productId = link.dataset.productId;
            removeFromCart(productId);
            // console.log(cart);

            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            // console.log(container);
            container.remove();
        });
    });