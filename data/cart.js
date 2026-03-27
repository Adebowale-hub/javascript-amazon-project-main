// Get a Variable out of a file with module
// 1. Add type="module" attribute
// 2. Export
// 3. import

// Export the cart
// To make the checkout page interactive
// Checkout Page Step 1: Create inside the cart some default values
// We create a cart variable that will hold the products added to the cart converted into a JSON string before saving it in the local storage


export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [
        {
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2, 
            deliveryOptionId: '1'
        },
        {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1,
            deliveryOptionId: '2'
        }];
    saveToStorage();
}

// Step 8: Create a function to save the cart in the local storage
function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Step 9: Create a Function to add products in the cart
export function addToCart(productId) {
    let matchingItem = cart.find(cartItem => cartItem.productId === productId);

    if (matchingItem) {
        matchingItem.quantity += Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
    } else {
        cart.push({
            productId: productId,
            quantity: Number(document.querySelector(`.js-quantity-selector-${productId}`).value)
        });
    }
    saveToStorage();
}

// Step 10: Create a function to remove products from the cart
export function removeFromCart(productId) {
    cart = cart.filter(cartItem => cartItem.productId !== productId);
    saveToStorage();
}

// Step 11: Create a function to calculate the total quantity of products in the cart
export function calculateCartQuantity() {
    let cartQuantity = cart.reduce((accum, cartItem) => accum + cartItem.quantity, 0);
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity; 
}

// Step 12: Create a function to update the quantity of a product
export function updateQuantity(productId, newQuantity) {
    let matchingItem = cart.find(cartItem => cartItem.productId === productId);
    if (matchingItem) {
        matchingItem.quantity = newQuantity;
        saveToStorage(); // Save the updated cart to storage
    }
}


// Initialize cart quantity on load
document.addEventListener('DOMContentLoaded', calculateCartQuantity);