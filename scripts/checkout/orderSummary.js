// Don't forget the Main Idea of JavaScript
// 1. Save the data
// 2. Generate the HTML
// 3. Make it interactive

// Checkout Page Step 2: Generate the HTML
import { cart, removeFromCart, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import formatCurrency from '../utils/money.js'; 

// import external librairies (dayjs) with JavaScript modules; Module always start with the word export and to use it, you need to import it.
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
// import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
// hello();
// console.log(dayjs());
// const today = dayjs();
// const deliveryDate = today.add(7, 'days');
// console.log(deliveryDate.format('dddd, MMMM D'));

export function renderOrderSummary() {
  // After combining the HTML together, 
// let's create a variable appear to store the result
let cartSummaryHTML = '';

// Checkout Page Step 3: Loop throw the cart and generate the HTML
// Search for the array for the full products details
cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    
    // Create a variable to save the result
    let matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
    );
    // console.log(deliveryDate.format('dddd, MMMM D'));

    const dateString = deliveryDate.format(
        'dddd, MMMM D'
    );

    // Loop throw the products array, duplicate and normalize the data 
    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });
    // console.log(matchingProduct); 

 
    // Store the generated HTML into the variable to appear (use of the accumulation pattern '+=')
    cartSummaryHTML +=`
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
           ${dateString}
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
            
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
            
            </div>
        </div>
        </div>
    `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );
 
      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    });

    return html;
  }

// console.log(cartSummaryHTML); 
// Generate the cartSummaryHTML with the id throws the cart array from the cart.js module 
document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
    .forEach((link) =>{
        link.addEventListener('click', () => {
            // console.log('delete');
            const productId = link.dataset.productId;
            // console.log(productId);
            removeFromCart(productId);
            // console.log(cart);

            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            // console.log(container);
            container.remove();
            // Update the data and regenerate the HTML payment summary 
            renderPaymentSummary();
        });
        
        // Change the delivery option when it's 'clicked'
        document.querySelectorAll('.js-delivery-option')
            .forEach((element) => {
              element.addEventListener('click', () => {
                const {productId, deliveryOptionId} = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                // Update the delivery date without needing to refresh the page when change the delivery option 
                // A function can call / re-run itself that's call -> recursion
                // 1.Update the data 2.Regenerate all the HTML = MVC -> stands for Model - View - Controller
                // - Model (Model Save and manage the data -> All the code in the data folder) 
                // - View (View takes the data and display it on a page.) 
                // - Controller (Controller runs some code which interact with a page and update the Model)
                renderOrderSummary();
                // Regenerate the HTML by changing the delivery option
                renderPaymentSummary(); 
              });
            });
    });
}
