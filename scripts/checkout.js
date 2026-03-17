import { cart, removeFromCart, calculateCartQuantity, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js"; // This a named export
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"; // This is a default export
import { deliveryOptions } from "../data/deliveryOptions.js";

// Step 1: Create the HTML for the order summary based on the products in the cart
let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct = products.find((product) => product.id === productId);

  // We generate the HTML for each product in the cart
  cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}" data-product-id="${productId}">
            <div class="delivery-date">Delivery date: 21 June</div>
            <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}">
                <div class="cart-item-details">
                    <div class="product-name">${matchingProduct.name}</div>
                    <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
                    <div class="product-quantity">
                        <span class="quantity-display">Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
                        <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                            Update
                        </span>
                        <input type="number" class="quantity-input js-quantity-input-${matchingProduct.id}" value="${cartItem.quantity}" min="1" style="width: 30px; display: none;">
                        <span class="save-quantity-link link-primary" style="display: none;">Save</span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
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

// We insert the generated HTML into the order summary container in the checkout page
document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

// Step 2: Add event listeners to the delete links to remove products from the cart and update the order summary
document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
    calculateCartQuantity();
  });
});

// Step 3: Add event listeners to the update links and show input when updating
document.querySelectorAll(".update-quantity-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent any default link behavior
    const productId = link.dataset.productId; // Get the productId from the data attribute

    // Get the cart item container
    const cartItemContainer = link.closest('.cart-item-container');

    // Add the class 'is-editing-quantity' to the container
    cartItemContainer.classList.add("is-editing-quantity");

    // Hide the quantity display and update link
    const quantityDisplay = cartItemContainer.querySelector(".quantity-display");
    const updateLink = cartItemContainer.querySelector(".update-quantity-link");

    quantityDisplay.style.display = "none"; // Hide quantity display
    updateLink.style.display = "none"; // Hide update link

    // Display the input and save link
    const quantityInput = cartItemContainer.querySelector(".quantity-input");
    const saveLink = cartItemContainer.querySelector(".save-quantity-link");
    quantityInput.style.display = "initial"; // Reset display for input
    saveLink.style.display = "initial"; // Reset display for save link

    // Add keyboard support for updating
    quantityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        validateAndSaveQuantity(cartItemContainer, quantityInput);
      }
    });
  });
});

// Step 4: Add event listeners to the save links to save the new quantity
document.querySelectorAll(".save-quantity-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent any default link behavior
    const cartItemContainer = link.closest('.cart-item-container'); // Get the cart item container

    // Call the function to validate and save quantity
    const quantityInput = cartItemContainer.querySelector(".quantity-input");
    validateAndSaveQuantity(cartItemContainer, quantityInput);
  });
});

// Function to validate and save the quantity
function validateAndSaveQuantity(cartItemContainer, quantityInput) {
  const newQuantity = Number(quantityInput.value);
  const productId = cartItemContainer.dataset.productId; // Get the productId

  // Validate the new quantity
  if (newQuantity < 0 || newQuantity >= 1000) {
    alert("Please enter a quantity between 0 and 999.");
    return;
  }

  // Remove the 'is-editing-quantity' class to reverse styles
  cartItemContainer.classList.remove("is-editing-quantity");

  // Hide the input and save link
  quantityInput.style.display = "none"; // Hide input
  const saveLink = cartItemContainer.querySelector(".save-quantity-link");
  saveLink.style.display = "none"; // Hide the save link

  // Show the original quantity display and update link
  const quantityDisplay = cartItemContainer.querySelector(".quantity-display");
  quantityDisplay.style.display = "inline"; // Show quantity display
  const updateLink = cartItemContainer.querySelector(".update-quantity-link");
  updateLink.style.display = "inline"; // Show update link

  // Update the quantity in the cart
  updateQuantity(productId, newQuantity);

  // Instantly update the displayed quantity in the HTML
  const quantityLabel = cartItemContainer.querySelector(".quantity-label");
  quantityLabel.textContent = newQuantity;

  // Update the header cart quantity display
  calculateCartQuantity();
}

// Initialize cart quantity on load
calculateCartQuantity();

function deliveryOptionsHTML(matchingProduct, cartItem) {
  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);

  let html = "";

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `<div class="delivery-option">
        <input 
            type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
        <div>
            <div class="delivery-option-date">
                ${dateString}
            </div>
            <div class="delivery-option-price">
                ${priceString} - Shipping
            </div>
        </div>
    </div>`;
  });

  return html;
}