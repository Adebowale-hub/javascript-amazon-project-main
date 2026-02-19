// Get a Variable out of a file with module
// 1. Add type="module" attribute
// 2. Export
// 3. import

// Export the cart
// To make the checkout page interactive
// Checkout Page Step 1: Create inside the cart some default values
export let cart = [
    {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2
    },
    {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1
    },
];

// Step 9: Create a Function to add products in the cart
// Step 10: Put related code together 
export function addToCart(productId) {
    // Create the variable to match the selected product with the productId 
    let matchingItem;
    
    
    // Loop throw the products and add them 
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });
    // console.log(matchingItem);

    if (matchingItem) {
        // Sort the items and make their total and also the total of all items
        matchingItem.quantity += Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
    } else {
        cart.push({
            productId: productId,
            quantity: Number(document.querySelector(`.js-quantity-selector-${productId}`).value)
        });
    }
}

export function removeFromCart(productId) {
    const newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });
   
    cart = newCart;
}
