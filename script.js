// =========================
// MENU DATA
// =========================

const menuItems = {
  coffee: [
    {
      name: "Espresso",
      price: 120,
      img: "https://images.unsplash.com/photo-1510707577719-ae7c14805e76?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Cappuccino",
      price: 150,
      img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Latte",
      price: 160,
      img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"
    }
  ],

  snacks: [
    {
      name: "Chocolate Muffin",
      price: 80,
      img: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Cheese Croissant",
      price: 100,
      img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80"
    }
  ],

  specials: [
    {
      name: "Caramel Frappe",
      price: 200,
      img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Mocha Delight",
      price: 180,
      img: "https://images.unsplash.com/photo-1579494941850-3d4e7f31e9f3?auto=format&fit=crop&w=900&q=80"
    }
  ]
};


// =========================
// FALLBACK IMAGES
// =========================

const fallbackImages = {
  coffee:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",

  snacks:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",

  specials:
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"
};


// =========================
// CART STORAGE
// =========================

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}


// =========================
// TOAST NOTIFICATION
// =========================

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) {
    console.log(message);
    return;
  }

  // Display the notification message
  toast.textContent = message;
  toast.classList.add("show");

  // Reset the previous timer
  clearTimeout(window.toastTimer);

  // Hide notification after 2.5 seconds
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


// =========================
// HOME PAGE MENU
// =========================

if (document.getElementById("menuGrid")) {
  const menuGrid = document.getElementById("menuGrid");
  const tabs = document.querySelectorAll(".tab");
  const cartCount = document.getElementById("cartCount");

  // Load menu items by category
  function loadMenu(category) {
    menuGrid.innerHTML = "";

    (menuItems[category] || []).forEach(item => {
      const card = document.createElement("div");
      card.className = "card";

      // Product image
      const img = document.createElement("img");

      img.src = item.img;
      img.alt = item.name;
      img.loading = "lazy";

      // Use fallback image if the original fails
      img.onerror = function () {
        if (this.dataset.fallbackApplied === "true") {
          this.alt = item.name + " image unavailable";
          this.style.objectFit = "contain";
          this.removeAttribute("src");
          return;
        }

        this.dataset.fallbackApplied = "true";
        this.src = fallbackImages[category] || fallbackImages.coffee;
      };

      // Product name
      const title = document.createElement("h3");
      title.textContent = item.name;

      // Product price
      const price = document.createElement("p");
      price.className = "price";
      price.textContent = "₹" + item.price;

      // Add to Cart button
      const button = document.createElement("button");
      button.className = "order-btn";
      button.type = "button";
      button.textContent = "Add to Cart";

      button.addEventListener("click", () => {
        window.addToCart(item.name, item.price);
      });

      // Add elements to card
      card.append(img, title, price, button);
      menuGrid.appendChild(card);
    });
  }

  // Load default category
  loadMenu("coffee");

  // Category tabs
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelector(".tab.active")?.classList.remove("active");

      tab.classList.add("active");

      loadMenu(tab.dataset.category);
    });
  });

  // Update cart item count
  function updateCartCount() {
    if (cartCount) {
      cartCount.innerText = getCart().length;
    }
  }

  updateCartCount();

  // Add product to cart
  window.addToCart = function (name, price) {
    const cart = getCart();

    cart.push({
      name: name,
      price: price
    });

    saveCart(cart);
    updateCartCount();

    // Show toast instead of browser alert
    showToast("✓ " + name + " added to your cart!");
  };
}


// =========================
// CART PAGE
// =========================

if (document.getElementById("cartItems")) {
  const cartItemsDiv = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  const cart = getCart();
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.textContent = "Your cart is empty. Add some coffee! ☕";
  } else {
    cartItemsDiv.innerHTML = cart.map(item => {
      const price = Number(item.price) || 0;

      total += price;

      const paragraph = document.createElement("p");
      paragraph.textContent = `${item.name} - ₹${price}`;

      return paragraph.outerHTML;
    }).join("");
  }

  if (cartTotal) {
    cartTotal.innerText = "₹" + total;
  }
}


// =========================
// ORDER PAGE
// =========================

if (document.getElementById("orderForm")) {
  const orderForm = document.getElementById("orderForm");
  const orderMessage = document.getElementById("orderMessage");

  orderForm.addEventListener("submit", event => {
    event.preventDefault();

    const cart = getCart();

    // Prevent checkout with an empty cart
    if (cart.length === 0) {
      orderMessage.textContent =
        "Your cart is empty! Please add items before placing an order. ☕";

      return;
    }

    // Calculate total
    const total = cart.reduce(
      (sum, item) => sum + (Number(item.price) || 0),
      0
    );

    // Display order confirmation
    orderMessage.textContent =
      `✅ Thank you! Your order has been placed. Total: ₹${total}`;

    // Clear cart after successful demo order
    localStorage.removeItem("cart");

    // Reset form
    orderForm.reset();
  });
}
// =========================
// CHECKOUT VALIDATION
// =========================

function proceedToCheckout() {
    const cart = getCart();
    const message = document.getElementById("checkoutMessage");

    if (cart.length === 0) {
        message.textContent =
            "☕ Your cart is empty! Please add a product before checkout.";

        return;
    }

    window.location.href = "order.html";
}
// =========================
// PROCEED TO CHECKOUT
// =========================

function proceedToCheckout() {
    const cart = getCart();
    const message = document.getElementById("checkoutMessage");

    // Block checkout if the cart is empty
    if (cart.length === 0) {
        if (message) {
            message.textContent =
                "☕ Your cart is empty! Please add a product first.";
        }
        return;
    }

    // Proceed only when items exist
    window.location.href = "order.html";
}
// =========================
// CLEAR CART
// =========================

function clearCart() {
    localStorage.removeItem("cart");

    // Reset cart items and total
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const message = document.getElementById("checkoutMessage");

    if (cartItems) {
        cartItems.innerHTML = "<p>Your cart is empty! ☕</p>";
    }

    if (cartTotal) {
        cartTotal.textContent = "₹0";
    }

    if (message) {
        message.textContent = "Your cart has been cleared!";
        message.style.color = "#4b2e2e";
    }
}
