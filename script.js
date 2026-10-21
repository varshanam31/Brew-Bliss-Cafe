// Menu Data — image URLs use Unsplash's image delivery parameters.
const menuItems = {
  coffee: [
    {name:"Espresso", price:120, img:"https://images.unsplash.com/photo-1510707577719-ae7c14805e76?auto=format&fit=crop&w=900&q=80"},
    {name:"Cappuccino", price:150, img:"https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80"},
    {name:"Latte", price:160, img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"}
  ],
  snacks: [
    {name:"Chocolate Muffin", price:80, img:"https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80"},
    {name:"Cheese Croissant", price:100, img:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80"}
  ],
  specials: [
    {name:"Caramel Frappe", price:200, img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"},
    {name:"Mocha Delight", price:180, img:"https://images.unsplash.com/photo-1579494941850-3d4e7f31e9f3?auto=format&fit=crop&w=900&q=80"}
  ]
};

const fallbackImages = {
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
  snacks: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
  specials: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"
};

// Save cart to localStorage safely.
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Home page menu.
if (document.getElementById("menuGrid")) {
  const menuGrid = document.getElementById("menuGrid");
  const tabs = document.querySelectorAll(".tab");
  const cartCount = document.getElementById("cartCount");

  function loadMenu(category) {
    menuGrid.innerHTML = "";
    (menuItems[category] || []).forEach(item => {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.name;
      img.loading = "lazy";
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

      const title = document.createElement("h3");
      title.textContent = item.name;
      const price = document.createElement("p");
      price.className = "price";
      price.textContent = "₹" + item.price;
      const button = document.createElement("button");
      button.className = "order-btn";
      button.type = "button";
      button.textContent = "Add to Cart";
      button.addEventListener("click", () => window.addToCart(item.name, item.price));

      card.append(img, title, price, button);
      menuGrid.appendChild(card);
    });
  }

  loadMenu("coffee");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelector(".tab.active")?.classList.remove("active");
      tab.classList.add("active");
      loadMenu(tab.dataset.category);
    });
  });

  function updateCartCount() {
    if (cartCount) cartCount.innerText = getCart().length;
  }
  updateCartCount();

  window.addToCart = function(name, price) {
    const cart = getCart();
    cart.push({name, price});
    saveCart(cart);
    updateCartCount();
    alert(name + " added to cart!");
  };
}

// Cart page.
if (document.getElementById("cartItems")) {
  const cartItemsDiv = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cart = getCart();
  let total = 0;
  cartItemsDiv.innerHTML = cart.map(item => {
    total += Number(item.price) || 0;
    return `<p>${item.name} - ₹${item.price}</p>`;
  }).join("");
  cartTotal.innerText = "₹" + total;
}

// Order page.
if (document.getElementById("orderForm")) {
  document.getElementById("orderForm").addEventListener("submit", e => {
    e.preventDefault();
    localStorage.removeItem("cart");
    document.getElementById("orderMessage").innerText = "✅ Your order has been placed!";
  });
}
