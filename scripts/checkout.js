import { cart, removeFromCart, calculateCartQuantity, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js"; // This a named export
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"; // This is a default export
import { deliveryOptions } from "../data/deliveryOptions.js";

// ---------- Helpers ----------

function getDeliveryOptionById(optionId) {
  return deliveryOptions.find((option) => option.id === optionId);
}

function formatDeliveryDate(deliveryDays) {
  // Use a fixed "today" once per render so all items in the cart share the same today date.
  // (You can remove this and call dayjs() inside if you want it to update per item.)
  const today = dayjs();
  const deliveryDate = today.add(deliveryDays, "day");
  return deliveryDate.format("dddd, MMMM D");
}

// We generate the HTML for delivery options for a given product cart item
function deliveryOptionsHTML(matchingProduct, cartItem) {
  const deliveryOptionId = cartItem.deliveryOptionId;

  let html = "";

  deliveryOptions.forEach((option) => {
    const dateString = formatDeliveryDate(option.deliveryDays);

    const priceString =
      option.priceCents === 0 ? "FREE" : `$${formatCurrency(option.priceCents)} -`;

    const isChecked = option.id === deliveryOptionId;

    html += `<div class="delivery-option">
        <input
          type="radio"
          ${isChecked ? "checked" : ""}
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
      </div>`;
  });

  return html;
}

// ---------- Build cart summary HTML ----------

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  const matchingProduct = products.find((product) => product.id === productId);
  if (!matchingProduct) return; // safety guard

  const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);

  // Fix: dateString must use the selected deliveryOption's deliveryDays
  const dateString = deliveryOption
    ? formatDeliveryDate(deliveryOption.deliveryDays)
    : formatDeliveryDate(0);

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}" data-product-id="${productId}">
      <div class="delivery-date">Delivery date: ${dateString}</div>
      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">
        <div class="cart-item-details">
          <div class="product-name">${matchingProduct.name}</div>
          <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
          <div class="product-quantity">
            <span class="quantity-display">
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input
              type="number"
              class="quantity-input js-quantity-input-${matchingProduct.id}"
              value="${cartItem.quantity}"
              min="1"
              style="width: 30px; display: none;">
            <span class="save-quantity-link link-primary" style="display: none;">Save</span>
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

// We insert the generated HTML into the order summary container in the checkout page
document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

// ---------- Delete links ----------

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    if (container) container.remove();

    calculateCartQuantity();
  });
});

// ---------- Update quantity links ----------

document.querySelectorAll(".update-quantity-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const productId = link.dataset.productId;

    const cartItemContainer = link.closest(".cart-item-container");

    // Add the class 'is-editing-quantity' to the container
    cartItemContainer.classList.add("is-editing-quantity");

    // Hide the quantity display and update link
    const quantityDisplay = cartItemContainer.querySelector(".quantity-display");
    const updateLink = cartItemContainer.querySelector(".update-quantity-link");

    quantityDisplay.style.display = "none";
    updateLink.style.display = "none";

    // Display the input and save link
    const quantityInput = cartItemContainer.querySelector(".quantity-input");
    const saveLink = cartItemContainer.querySelector(".save-quantity-link");

    quantityInput.style.display = "initial";
    saveLink.style.display = "initial";

    // Add keyboard support for updating
    quantityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        validateAndSaveQuantity(cartItemContainer, quantityInput);
      }
    });
  });
});

// ---------- Save quantity links ----------

document.querySelectorAll(".save-quantity-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const cartItemContainer = link.closest(".cart-item-container");
    const quantityInput = cartItemContainer.querySelector(".quantity-input");
    validateAndSaveQuantity(cartItemContainer, quantityInput);
  });
});

// Function to validate and save the quantity
function validateAndSaveQuantity(cartItemContainer, quantityInput) {
  const newQuantity = Number(quantityInput.value);
  const productId = cartItemContainer.dataset.productId;

  if (Number.isNaN(newQuantity) || newQuantity < 0 || newQuantity >= 1000) {
    alert("Please enter a quantity between 0 and 999.");
    return;
  }

  cartItemContainer.classList.remove("is-editing-quantity");

  // Hide input and save link
  quantityInput.style.display = "none";
  const saveLink = cartItemContainer.querySelector(".save-quantity-link");
  if (saveLink) saveLink.style.display = "none";

  // Show original quantity display and update link
  const quantityDisplay = cartItemContainer.querySelector(".quantity-display");
  if (quantityDisplay) quantityDisplay.style.display = "inline";

  const updateLink = cartItemContainer.querySelector(".update-quantity-link");
  if (updateLink) updateLink.style.display = "inline";

  // Update quantity in the cart
  updateQuantity(productId, newQuantity);

  // Update displayed quantity in the HTML
  const quantityLabel = cartItemContainer.querySelector(".quantity-label");
  if (quantityLabel) quantityLabel.textContent = newQuantity;

  // Update header cart quantity display
  calculateCartQuantity();
}

// Initialize cart quantity on load
calculateCartQuantity();