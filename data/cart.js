// Get a Variable out of a file with module
// 1. Add type="module" attribute
// 2. Export
// 3. import

// Export the cart
// To make the checkout page interactive
// Checkout Page Step 1: Create inside the cart some default values
export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [
        {
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2
        },
        {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1
        },
    ];
    saveToStorage();
}
// Step 8: Create a function to save the cart in the local storage
function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Step 9: Create a Function to add products in the cart
export function addToCart(productId) {
    // We check if the product is already in the cart
    let matchingItem = cart.find(cartItem => cartItem.productId === productId);

    if (matchingItem) {
        // If the product is already in the cart, we update the quantity
        matchingItem.quantity += Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
    } else {
        cart.push({
            // If the product is not in the cart, we add it with the quantity
            productId: productId,
            // We get the quantity from the select element in the amazon.js file
            quantity: Number(document.querySelector(`.js-quantity-selector-${productId}`).value)
        });
    }
    // We save the cart in the local storage to keep the data even if we refresh the page
    saveToStorage();
}
// Step 10: Create a function to remove products from the cart
export function removeFromCart(productId) {
    // We filter the cart to remove the product with the matching productId
    cart = cart.filter(cartItem => cartItem.productId !== productId);
    saveToStorage();
}
// Step 11: Create a function to calculate the total quantity of products in the cart
export function calculateCartQuantity() {
    // We use the reduce method to sum the quantity of all products in the cart
    let cartQuantity = cart.reduce((accum, cartItem) => accum + cartItem.quantity, 0);
    // We update the cart quantity in the header
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity; 
    console.log(cart);
}

// Initialize cart quantity on load
document.addEventListener('DOMContentLoaded', calculateCartQuantity);