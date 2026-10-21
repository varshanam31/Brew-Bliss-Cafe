# ☕ Brew Bliss Café

A responsive café ordering **front-end demo** built with HTML, CSS, and vanilla JavaScript.

## Features

- Responsive home page with café branding and hero section
- Menu search and category filters
- Coffee, snack, and speciality products with image fallbacks
- Shopping cart with quantity controls, remove-item actions, subtotal, and delivery fee
- Checkout form with basic required-field and Indian mobile-number validation
- Demo order confirmation with a generated order ID
- Local admin dashboard to add/remove menu items and review/clear demo orders
- Browser `localStorage` persistence

## Project structure

```text
Brew-Bliss-Cafe/
├── index.html
├── cart.html
├── order.html
├── admin.html
├── style.css
├── script.js
└── README.md
```

## Run locally

1. Download and extract the project.
2. Open the folder in Visual Studio Code.
3. Start `index.html` with the Live Server extension, or open it directly in a browser.
4. Use the navigation to browse the menu, manage your cart, check out, or open the demo admin page.

## Important limitations

This project is front-end only. Cart, menu changes, and demo orders are saved in the current browser's local storage. The admin page has **no authentication or server-side security**. Orders are not sent to a real café, there is no shared database, and no payment is processed. Do not use it to collect real customer data or for production operations.

Menu photos load from Unsplash and need an internet connection. If a menu photo fails, the site attempts to use a category fallback image.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser local storage
- Unsplash images
