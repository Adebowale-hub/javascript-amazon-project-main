// Main Idea of JavaScript
// 1. Save the data
// 2. Generate the HTML
// 3. Make it interactive

// Get the cart
import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from '../utils/money.js';

export function renderPaymentSummary() {
    // console.log('payment summary');
    // productPriceCents initialize at 0;
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    
    // Step 1: 1. Save the data -> MVC = Model
    // Calculate the items cost -> Steps:
    // 1. Loop through the cart
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        // 2. For each product, price * quantity
        // Every time we loop throw the cart we are going to add it to the variable productPriceCents
        productPriceCents += product.priceCents * cartItem.quantity;
        
        // 3. Cost of shipping
        // Steps: 
        // 1. Loop through the cart 
        // 2. Add all the shipping costs together 
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;     
    });

    // console.log(productPriceCents);
    // console.log(shippingPriceCents);

    // 4. Calculate the Total before Tax
    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    // 5. Calculate the Tax of 10%
    const taxCents = totalBeforeTaxCents * 0.1;
    // 6. Add everything together
    const totalCents = totalBeforeTaxCents + taxCents;

    // Step 2: 2. Generate the HTML(View) -> MVC = View
    const paymentSummaryHTML = `
        <div class="payment-summary-title">
         Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (3):</div>
          <div class="payment-summary-money">
            $${formatCurrency(productPriceCents)} 
          </div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">
            $${formatCurrency(shippingPriceCents)}
          </div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">
            $${formatCurrency(totalBeforeTaxCents)}
          </div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">
            $${formatCurrency(taxCents)}
          </div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">
            $${formatCurrency(totalCents)}
          </div>
        </div>

        <button class="place-order-button button-primary">
          Place your order
        </button>
        
    `;

    // Change the HTML and replace it by the HTML created by the JavaScript paymentSummaryHTML
    document.querySelector('.js-payment-summary')
      .innerHTML = paymentSummaryHTML;
}