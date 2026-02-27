import { cart, removeFromCart, calculateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js"; // This a named export
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"; // This is a default export
import { deliveryOptions } from "../data/deliveryOptions.js";

// const today = dayjs();
// const deliveryDate = today.add(7, "days");
// console.log(deliveryDate);
// console.log(deliveryDate.format("dddd, MMMM D"));

// Step 1: Create the HTML for the order summary based on the products in the cart
let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  // We get the productId from the cart item
  const productId = cartItem.productId;
  // We find the matching product in the products array using the productId from the cart
  let matchingProduct = products.find((product) => product.id === productId);
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
                        <span class="update-quantity-link link-primary">
                            Update
                            <span>
                                <input type="number" class="quantity-input js-quantity-input-${matchingProduct.id}" value="${cartItem.quantity}" min="1">
                            </span>
                            <span>Save</span>
                        </span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
                    </div>
                </div>
                
                <div class="delivery-options">
                    <div class="delivery-options-title">
                    Choose a delivery option:
                    </div>

                    ${deliveryOptionsHTML(matchingProduct)}
                
                </div>
            </div>
        </div>
    `;
});


// We insert the generated HTML into the order summary container in the checkout page
document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;
// Step 2: Add event listeners to the delete links to remove products from the cart and update the order summary
document.querySelectorAll(".js-delete-link").forEach((link) => {
  // We add an event listener to each delete link to remove the product from the cart when clicked
  link.addEventListener("click", () => {
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

document.querySelectorAll(".update-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link
      .closest(".cart-item-container")
      .querySelector(".js-delete-link").dataset.productId;
    const newQuantity = `<input type="number" class="quantity-input js-quantity-input-${matchingProduct.id}" value="${cartItem.quantity}" min="1">`;
    if (newQuantity > 0) {
      const cartItem = cart.find((item) => item.productId === productId);
      cartItem.quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      document.querySelector(
        `.js-cart-item-container-${productId} .quantity-label`,
      ).textContent = newQuantity;
      calculateCartQuantity();
    } else {
      console.log(newQuantity);
    }
  });
});

// Initialize cart quantity on load
calculateCartQuantity();

function deliveryOptionsHTML(matchingProduct) {
    let html = "";

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

        html += `<div class="delivery-option">
            <input type="radio" class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
            <div>
                <div class="delivery-option-date">
                    ${dateString}
                </div>
                <div class="delivery-option-price">
                    ${priceString} - Shipping
                </div>
            </div>
        </div>`
    });

    return html;
}
