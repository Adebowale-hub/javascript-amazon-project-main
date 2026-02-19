// Get a Variable out of a file with module
// 1. Add type="module" attribute
// 2. Export
// 3. import

// Export the cart
// To make the checkout page interactive
// Checkout Page Step 1: Create inside the cart some default values

// export let cart -> export let cart = undefined;
// We create an object called cart = {} to convert cart.js into Oriented Object Programming 
// Object-Oriented Programming = tries to represent the real world.
// Cart -> means Cady in french.

// Class -> is basically an object generator
// Converts the cart from a Function to a Class
class Cart {
    // Add property to a class so that every object created with this class will have this property.
    cartItems; // cartItems; means -> cartItems = undefined;
    // #localStorageKey private property or private field
    #localStorageKey; // localStorageKey; means -> localStorageKey = undefined; 
    // and # is to make localStorageKey private

    // The constructor setup the objects
    constructor(localStorageKey) {
        // Set the property called localStorageKey
        this.#localStorageKey = localStorageKey;
        this.#loadFromStorage();
    }

    // Add some Methods to the Cart Class  
    // Add loadFromStorage method to this class
    // loadFromStorage : function() -> loadFromStorage()
    #loadFromStorage() {
            // Get the cart from the local Storage instead of using default values.
            this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey));

            if (!this.cartItems) {
                // Use Default values for products in the cart array to avoid null : export let cart = [];
                this.cartItems = [
                    {
                        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                        quantity: 1,
                        deliveryOptionId: '1'
                    },
                    {
                        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                        quantity: 1,
                        deliveryOptionId: '3'
                    }
                ];
            }
    }

    // Add a method to Save our cart to the local storage and don't need to reset or to refresh the page.
    saveToStorage() {
    // What we want to save = 'cart' and convert it into a string 
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }

    // Step 9: Create a Function to add products in the cart
    // Step 10: Put related code together 
    addToCart(productId) {
            // Create the variable to match the selected product with the productId 
            let matchingItem; 
            // Loop throw the products and add them 
            this.cartItems.forEach((cartItem) => {
                if (productId === cartItem.productId) {
                    matchingItem = cartItem;
                }
            });
            // console.log(matchingItem);

            if (matchingItem) {
                matchingItem.quantity += 1;
            } else {
                // console.log('Affiche something');
                this.cartItems.push({
                    productId: productId,
                    quantity: 1,
                    deliveryOptionsId: '1'
                });
                // console.log(cart.length);
            }
            // After adding products to the cart, save them to the local storage.
            this.saveToStorage();
    }

    // removeFromCart Method
    removeFromCart(productId) {
        const newCart = [];

        this.cartItems.forEach((cartItem) => {
            if(cartItem.productId !== productId) {
            // Contains all the cartItem that doesn't match the selected productId
            newCart.push(cartItem);    
            }
        });

        this.cartItems = newCart;

        // Remove function finished and save to the local storage
        this.saveToStorage();
    }

    updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;

        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
            matchingItem = cartItem;
            }
        });

        matchingItem.deliveryOptionId = deliveryOptionId;

        this.saveToStorage();
    }
}

// Generate 2 instances or objects with the Cart's Class
const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

// cart.#localStorageKey = 'test';

console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);

// cart.addToCart('83d4ca15-0f35-48f5-b7a3-1ea210004f2e');
 