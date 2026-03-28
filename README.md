# IMPROVEMENTS MADE

### 🐛 What issues did I find?
I consistently identified and resolved several critical functional and UI bugs:

* **UI/Layout Bugs**: I found that elements were overlapping unexpectedly (fix: set high z-index on navbar to prevent overlap) and that the page had horizontal scrolling issues (fix: resolve horizontal scrolling overflow by defining global box-sizing property).
* **State & Logic Bugs**: I fixed desyncs between different pages (Cart quantity fixed for the amazon and the checkout pages), resolved empty deliveryOptionId bugs in the cart, and fixed price formatting.
* **Module/Caching Issues**: I identified naming conflicts in my modules, fixed a typo breaking backend data loading, and resolved stale code issues by aggressively bypassing browser caching on checkout dependencies.
* **Hardcoded Data**: I found that checkout HTML was static, resolving it by replacing hardcoded blocks with a dynamic JavaScript container.

### ✨ What did I improve?

* **Premium Styling**: I overhauled the design completely, upgrading the body, product cards, and buttons with a "premium design."
* **Responsive Layouts**: I improved the product grid layout (configuring it to display 3 cards per row and adjusting padding) and added a premium hero section to make the homepage look professional.
* **User Experience (UX)**: I converted generic "modify-cart" links into modern buttons, made the delete button prominent and destructive to prevent accidental clicks, and added an "added-to-cart" toast notification UI for better user feedback.
* **Code Organization**: I improved internal naming conventions (e.g., renaming amazon.html to index.html, and cleaning up the tests directory).

### 🚀 What features did I add?

* **Dynamic Checkout & Payment**: I made the order payment summary truly dynamic and mathematically tied to the exact state of the shopping cart array.
* **Advanced Cart Features**: I added functionalities to update quantities dynamically, remove products, track delivery dates and shipping options, and count total items accurately.
* **Data Persistence & Fetching**: I integrated localStorage to save user carts between sessions and added logic to load product data directly from a backend endpoint.
* **Automated Testing**: Important core functionalities! I implemented the Jasmine testing framework and wrote automated test suites for orderSummary, addToCart, and money-formatting calculations.

### 🤔 Why did my changes make the product better?

* **Higher Reliability**: By implementing automated tests and fixing module conflicts, regressions are far less likely to happen. The transition from hardcoded HTML to dynamic JavaScript means the interface is now a true reflection of underlying data.
* **Enhanced User Trust**: The overhaul with a "premium design", functioning interactive toast notifications, and properly formatted prices makes the e-commerce store look credible and trustworthy to users.
* **Seamless Experience**: Implementing localStorage ensures users don't lose their cart when they close the tab, and removing UI bugs like horizontal scrolls creates a frictionless browsing experience.

### 🏗️ Technical decisions I made

* **Adopting Object-Oriented Programming (OOP)**: I initiated a major architectural shift by converting basic product and cart structures into Classes, utilizing encapsulation (making storage properties private) and leveraging Inheritance and Polymorphism (e.g., to handle specific product types like size charts).
* **Modular JavaScript**: I decided to break up my logic into separate files/modules and used import/exports to avoid naming conflicts and make the codebase scalable.
* **Choosing Jasmine for TDD**: I elected to set up Jasmine to bring behavior-driven testing into the project instead of solely relying on manual verification.
* **CSS Best Practices**: Instead of patching layout bugs individually, I made fundamental CSS architectural decisions—like defining global box-sizing: border-box and tweaking z-index stacking contexts.
