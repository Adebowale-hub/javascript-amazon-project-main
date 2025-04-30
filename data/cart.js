// Get a Variable out of a file with module
// 1. Add type="module" attribute
// 2. Export
// 3. import

// Export the cart
// To make the checkout page interactive
// Checkout Page Step 1: Create inside the cart some default values

// Get the cart from the local Storage instead of using default values.
export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    // Use Default values for products in the cart array to avoid null : export let cart = [];
    cart = [
        // {
        //     productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        //     quantity: 1,
        // },
        // {
        //     productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        //     quantity: 1
        // }
    ];
}



// Save our cart to the local storage and don4t need to reset or to refresh the page.
function saveToStorage() {
    // What we want to save = 'cart' and convert it into a string 
    localStorage.setItem('cart', JSON.stringify(cart));
}

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
        matchingItem.quantity += 1;
    } else {
        // console.log('Affiche something');
        cart.push({
            productId: productId,
            quantity: 1
        });
        // console.log(cart.length);
    }
    // After adding products to the cart, save them to the local storage.
    saveToStorage();
}

export function removeFromCart(productId) {
   const newCart = [];

   cart.forEach((cartItem) => {
    if(cartItem.productId !== productId) {
       // Contains all the cartItem that doesn't match the selected productId
       newCart.push(cartItem);    
    }
   });

   cart = newCart;

   // Remove function finished and save to the local storage
   saveToStorage();
}