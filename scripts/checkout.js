import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
// import '../data/cart-oop.js';
// import '../data/cart-class.js';
// import '../data/backend-practice.js';

loadProducts(() => {
    // console.log(renderOrderSummary());
    renderOrderSummary();
    // console.log(renderPaymentSummary());
    renderPaymentSummary();
});