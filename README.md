# ☕ Brew Bliss Café

A simple and responsive coffee shop website built with **HTML, CSS, and JavaScript**. Browse coffee, snacks, and special drinks, add items to your cart, and place an order through the checkout form.

## ✨ Features

- **Home page** with a café hero section and menu.
- **Menu categories** for Coffee, Snacks, and Specials.
- **Add to Cart** functionality for menu items.
- **Cart page** showing selected items and the total price in Indian Rupees (₹).
- **Order page** with name, address, and phone number fields.
- **Local storage** to retain cart items while navigating between pages.
- **Responsive menu grid** and styled navigation.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser `localStorage`
- Unsplash images for café and menu visuals

## 📁 Project Structure

```text
Brew-Bliss-Cafe/
├── home.html
├── cart.html
├── order.html
├── style.css
└── script.js
```

> Make sure the CSS and JavaScript files are named `style.css` and `script.js`, as referenced by the HTML pages. If your files have different names, rename them or update the references.

## 🚀 Getting Started

1. Download or clone this repository.
2. Keep all five project files in the same folder.
3. Open `home.html` in your browser.
4. Browse the menu, add an item to the cart, and visit the Cart and Order pages.

You can also run the project using the **Live Server** extension in Visual Studio Code.

## ☕ Menu

| Category | Items | Price |
|---|---|---:|
| Coffee | Espresso | ₹120 |
| Coffee | Cappuccino | ₹150 |
| Coffee | Latte | ₹160 |
| Snacks | Chocolate Muffin | ₹80 |
| Snacks | Cheese Croissant | ₹100 |
| Specials | Caramel Frappe | ₹200 |
| Specials | Mocha Delight | ₹180 |

## 🛒 How It Works

1. Choose a menu category on the home page.
2. Select **Add to Cart** for an item.
3. Open the Cart page to review the items and total.
4. Continue to the Order page and fill in the required details.
5. Submit the form to see the order confirmation message.

## ⚠️ Notes

- This is a front-end demo project. It does not include a backend, database, online payment system, or actual order submission service.
- Cart data is stored in the browser's local storage.
- The current order form displays a confirmation message and clears the cart; it does not send the order to a café.
- Menu and hero images are loaded from Unsplash and require an internet connection.

## 🔮 Future Improvements

- Add item quantity controls and remove-from-cart functionality.
- Validate and improve the checkout flow.
- Connect a backend and database to store orders.
- Add payment integration and order status tracking.
- Improve accessibility and mobile navigation.

## 👩‍💻 Author

Created as a front-end web development project.

---

Made with ❤️ and ☕
