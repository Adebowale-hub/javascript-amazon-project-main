import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

function getDeliveryOptionById(optionId) {
  return deliveryOptions.find((option) => option.id === optionId);
}

function formatDeliveryDate(deliveryDays) {
  const today = dayjs();
  const deliveryDate = today.add(deliveryDays, "day");
  return deliveryDate.format("dddd, MMMM D");
}

function deliveryOptionsHTML(matchingProduct, cartItem) {
  const deliveryOptionId = cartItem.deliveryOptionId;
  let html = "";
  deliveryOptions.forEach((option) => {
    const dateString = formatDeliveryDate(option.deliveryDays);
    const priceString = option.priceCents === 0 ? "FREE" : `$${formatCurrency(option.priceCents)} -`;
    const isChecked = option.id === deliveryOptionId;
    html += `<div class="delivery-option js-delivery-option"
                data-product-id="${matchingProduct.id}"
                data-delivery-option-id="${option.id}">
        <input type="radio" ${isChecked ? "checked" : ""}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
      </div>`;
  });
  return html;
}

export function renderOrderSummary() {
  let cartSummaryHTML = "";
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = products.find((product) => product.id === productId);
    if (!matchingProduct) return;

    const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);
    const dateString = deliveryOption ? formatDeliveryDate(deliveryOption.deliveryDays) : formatDeliveryDate(0);

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
              <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">Update</span>
              <input type="number" class="quantity-input js-quantity-input-${matchingProduct.id}" value="${cartItem.quantity}" min="1" style="width: 30px; display: none;">
              <span class="save-quantity-link link-primary" style="display: none;">Save</span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary();
      renderPaymentSummary();
      calculateCartQuantity();
    });
  });

  document.querySelectorAll(".update-quantity-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const cartItemContainer = link.closest(".cart-item-container");
      cartItemContainer.classList.add("is-editing-quantity");
      cartItemContainer.querySelector(".quantity-display").style.display = "none";
      link.style.display = "none";
      cartItemContainer.querySelector(".quantity-input").style.display = "initial";
      cartItemContainer.querySelector(".save-quantity-link").style.display = "initial";
    });
  });

  document.querySelectorAll(".save-quantity-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const cartItemContainer = link.closest(".cart-item-container");
      const quantityInput = cartItemContainer.querySelector(".quantity-input");
      validateAndSaveQuantity(cartItemContainer, quantityInput);
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

function validateAndSaveQuantity(cartItemContainer, quantityInput) {
  const newQuantity = Number(quantityInput.value);
  const productId = cartItemContainer.dataset.productId;
  if (Number.isNaN(newQuantity) || newQuantity < 0 || newQuantity >= 1000) {
    alert("Please enter a quantity between 0 and 999.");
    return;
  }
  updateQuantity(productId, newQuantity);
  renderOrderSummary();
  renderPaymentSummary();
  calculateCartQuantity();
}

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartItemTotal = 0;

  cart.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) return;

    productPriceCents += product.priceCents * cartItem.quantity;
    cartItemTotal += cartItem.quantity;

    const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);
    if (deliveryOption) {
      shippingPriceCents += deliveryOption.priceCents;
    }
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">Order Summary</div>
    <div class="payment-summary-row">
      <div>Items (${cartItemTotal}):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>
    <button class="place-order-button button-primary">Place your order</button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}

calculateCartQuantity();
renderOrderSummary();
renderPaymentSummary();