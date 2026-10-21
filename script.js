(() => {
  "use strict";

  const STORAGE = {
    cart: "brewBlissCartV2",
    menu: "brewBlissMenuV2",
    orders: "brewBlissOrdersV2"
  };

  const initialMenu = [
    { id: "espresso", name: "Espresso", price: 120, category: "coffee", description: "A rich, bold shot to start your day.", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e76?auto=format&fit=crop&w=900&q=80" },
    { id: "cappuccino", name: "Cappuccino", price: 150, category: "coffee", description: "Espresso with velvety steamed milk foam.", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80" },
    { id: "latte", name: "Latte", price: 160, category: "coffee", description: "Smooth espresso softened with creamy milk.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80" },
    { id: "chocolate-muffin", name: "Chocolate Muffin", price: 80, category: "snacks", description: "A soft chocolate treat for your coffee break.", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80" },
    { id: "cheese-croissant", name: "Cheese Croissant", price: 100, category: "snacks", description: "Flaky pastry with a warm, cheesy centre.", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80" },
    { id: "caramel-frappe", name: "Caramel Frappe", price: 200, category: "specials", description: "A chilled, creamy caramel coffee favourite.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80" },
    { id: "mocha-delight", name: "Mocha Delight", price: 180, category: "specials", description: "Coffee and chocolate come together in one cup.", image: "https://images.unsplash.com/photo-1579494941850-3d4e7f31e9f3?auto=format&fit=crop&w=900&q=80" }
  ];

  const fallbackImages = {
    coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    snacks: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
    specials: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"
  };

  const readJSON = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };
  const saveJSON = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { alert("Your browser could not save this data. Try enabling local storage."); return false; }
  };
  const money = amount => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  const safeText = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const getMenu = () => {
    const stored = readJSON(STORAGE.menu, null);
    return Array.isArray(stored) ? stored : initialMenu.map(item => ({ ...item }));
  };
  const setMenu = menu => saveJSON(STORAGE.menu, menu);
  const getCart = () => {
    const cart = readJSON(STORAGE.cart, []);
    return Array.isArray(cart) ? cart.filter(item => item && typeof item.id === "string" && Number.isFinite(item.price) && Number.isFinite(item.qty) && item.qty > 0) : [];
  };
  const setCart = cart => { saveJSON(STORAGE.cart, cart); updateCartCount(); };
  const getOrders = () => {
    const orders = readJSON(STORAGE.orders, []);
    return Array.isArray(orders) ? orders : [];
  };
  const cartCount = cart => cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart => cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = cart => cart.length ? 30 : 0;

  function updateCartCount() {
    const count = cartCount(getCart());
    document.querySelectorAll("#navCartCount").forEach(node => { node.textContent = count; });
  }

  function setupNavigation() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }));
  }

  function setupFooter() {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  function renderMenu() {
    const grid = document.getElementById("menuGrid");
    if (!grid) return;
    const search = document.getElementById("menuSearch");
    const empty = document.getElementById("menuEmpty");
    let category = "all";
    const draw = () => {
      const query = (search?.value || "").trim().toLowerCase();
      const items = getMenu().filter(item =>
        (category === "all" || item.category === category) &&
        `${item.name} ${item.description || ""} ${item.category}`.toLowerCase().includes(query)
      );
      grid.innerHTML = items.map(item => `
        <article class="product-card">
          <div class="product-image-wrap">
            <img class="product-image" src="${safeText(item.image || fallbackImages[item.category] || fallbackImages.coffee)}" alt="${safeText(item.name)}" loading="lazy" data-category="${safeText(item.category)}">
            <span class="product-category">${safeText(item.category)}</span>
          </div>
          <div class="product-content">
            <h3>${safeText(item.name)}</h3>
            <p class="product-description">${safeText(item.description || "A Brew Bliss café favourite, prepared fresh for you.")}</p>
            <div class="product-bottom"><span class="product-price">${money(item.price)}</span><button type="button" class="add-btn" data-add="${safeText(item.id)}">+ Add to cart</button></div>
          </div>
        </article>`).join("");
      empty?.classList.toggle("hidden", items.length > 0);
      grid.querySelectorAll("img").forEach(img => {
        img.addEventListener("error", () => {
          if (img.dataset.fallbackApplied === "true") return;
          img.dataset.fallbackApplied = "true";
          img.src = fallbackImages[img.dataset.category] || fallbackImages.coffee;
        }, { once: true });
      });
    };
    document.querySelectorAll(".filter-btn").forEach(button => button.addEventListener("click", () => {
      category = button.dataset.category || "all";
      document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.toggle("active", btn === button));
      draw();
    }));
    search?.addEventListener("input", draw);
    grid.addEventListener("click", event => {
      const button = event.target.closest("[data-add]");
      if (!button) return;
      const item = getMenu().find(entry => entry.id === button.dataset.add);
      if (!item) return;
      const cart = getCart();
      const existing = cart.find(entry => entry.id === item.id);
      if (existing) existing.qty += 1;
      else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
      setCart(cart);
      const original = button.textContent;
      button.textContent = "Added ✓";
      setTimeout(() => { if (button.isConnected) button.textContent = original; }, 900);
    });
    draw();
  }

  function renderCart() {
    const container = document.getElementById("cartItems");
    if (!container) return;
    const cart = getCart();
    const sum = subtotal(cart);
    const fee = deliveryFee(cart);
    const checkout = document.getElementById("checkoutLink");
    document.getElementById("cartSubtotal").textContent = money(sum);
    document.getElementById("cartDelivery").textContent = money(fee);
    document.getElementById("cartTotal").textContent = money(sum + fee);
    if (checkout) checkout.classList.toggle("disabled-link", cart.length === 0);
    if (!cart.length) {
      container.innerHTML = `<div class="empty-cart"><div class="empty-icon">🛒</div><h3>Your cart is taking a little break</h3><p>Add something delicious from our menu to get started.</p><a class="btn btn-primary" href="index.html#menu">Browse the menu</a></div>`;
      return;
    }
    container.innerHTML = cart.map(item => `
      <article class="cart-row">
        <div><div class="cart-item-name">${safeText(item.name)}</div><div class="cart-item-unit">${money(item.price)} each</div></div>
        <div class="cart-row-right"><div class="quantity-control" aria-label="Quantity for ${safeText(item.name)}"><button type="button" data-qty="-1" data-id="${safeText(item.id)}" aria-label="Decrease ${safeText(item.name)} quantity">−</button><strong>${item.qty}</strong><button type="button" data-qty="1" data-id="${safeText(item.id)}" aria-label="Increase ${safeText(item.name)} quantity">+</button></div><strong class="cart-line-price">${money(item.price * item.qty)}</strong><button type="button" class="remove-btn" data-remove="${safeText(item.id)}">Remove</button></div>
      </article>`).join("");
    container.querySelectorAll("[data-qty]").forEach(button => button.addEventListener("click", () => {
      const id = button.dataset.id, change = Number(button.dataset.qty);
      const updated = getCart().map(item => item.id === id ? { ...item, qty: item.qty + change } : item).filter(item => item.qty > 0);
      setCart(updated); renderCart();
    }));
    container.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => {
      setCart(getCart().filter(item => item.id !== button.dataset.remove)); renderCart();
    }));
  }

  function renderCheckout() {
    const itemsContainer = document.getElementById("checkoutItems");
    const form = document.getElementById("orderForm");
    if (!itemsContainer || !form) return;
    const cart = getCart();
    const sum = subtotal(cart), fee = deliveryFee(cart);
    itemsContainer.innerHTML = cart.length ? cart.map(item => `<div class="checkout-item"><span>${safeText(item.name)} × ${item.qty}</span><strong>${money(item.price * item.qty)}</strong></div>`).join("") : `<p class="admin-empty">Your cart is empty. <a class="text-link" href="index.html#menu">Browse the menu</a>.</p>`;
    document.getElementById("checkoutSubtotal").textContent = money(sum);
    document.getElementById("checkoutDelivery").textContent = money(fee);
    document.getElementById("checkoutTotal").textContent = money(sum + fee);
    const submit = form.querySelector('button[type="submit"]');
    if (!cart.length && submit) submit.disabled = true;
    form.addEventListener("submit", event => {
      event.preventDefault();
      const currentCart = getCart();
      if (!currentCart.length) {
        document.getElementById("orderMessage").textContent = "Your cart is empty. Add an item before checking out.";
        return;
      }
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const order = {
        id: "BB-" + Date.now().toString(36).toUpperCase(),
        createdAt: new Date().toISOString(),
        customer: { name: data.get("customerName").trim(), phone: data.get("customerPhone").trim(), address: data.get("customerAddress").trim(), notes: data.get("customerNotes").trim() },
        items: currentCart.map(item => ({ ...item })),
        subtotal: subtotal(currentCart),
        delivery: deliveryFee(currentCart),
        total: subtotal(currentCart) + deliveryFee(currentCart)
      };
      const orders = getOrders();
      orders.unshift(order);
      if (!saveJSON(STORAGE.orders, orders)) return;
      setCart([]);
      form.reset();
      document.getElementById("orderMessage").textContent = "";
      const panel = document.getElementById("confirmationPanel");
      panel.innerHTML = `<h2>✓ Your demo order is confirmed!</h2><p>Order ID: <strong>${safeText(order.id)}</strong></p><p>Total: <strong>${money(order.total)}</strong></p><p>Your order is saved in this browser for the demo. No café has received it.</p><a class="btn btn-secondary" href="index.html#menu" style="margin-top:15px">Back to menu</a>`;
      panel.classList.remove("hidden");
      renderCheckout();
    });
  }

  function renderAdmin() {
    const list = document.getElementById("adminMenuList");
    if (!list) return;
    const render = () => {
      const menu = getMenu(), orders = getOrders();
      document.getElementById("adminMenuCount").textContent = menu.length;
      document.getElementById("adminOrderCount").textContent = orders.length;
      document.getElementById("adminOrderValue").textContent = money(orders.reduce((sum, order) => sum + Number(order.total || 0), 0));
      list.innerHTML = menu.length ? menu.map(item => `<div class="admin-list-item"><div><strong>${safeText(item.name)} · ${money(item.price)}</strong><small>${safeText(item.category)}</small></div><button class="btn btn-danger btn-small" type="button" data-delete-menu="${safeText(item.id)}">Remove</button></div>`).join("") : `<p class="admin-empty">No menu items yet.</p>`;
      const orderContainer = document.getElementById("adminOrders");
      orderContainer.innerHTML = orders.length ? orders.map(order => `<article class="admin-order"><div class="admin-order-head"><strong>${safeText(order.id)} · ${safeText(order.customer?.name || "Customer")}</strong><strong>${money(Number(order.total || 0))}</strong></div><small>${new Date(order.createdAt).toLocaleString()} · ${safeText(order.customer?.phone || "")}</small><p>${safeText(order.customer?.address || "")}</p><ul>${(order.items || []).map(item => `<li>${safeText(item.name)} × ${Number(item.qty || 1)} — ${money(Number(item.price || 0) * Number(item.qty || 1))}</li>`).join("")}</ul>${order.customer?.notes ? `<p>Note: ${safeText(order.customer.notes)}</p>` : ""}</article>`).join("") : `<p class="admin-empty">No demo orders have been saved in this browser.</p>`;
    };
    document.getElementById("addMenuForm").addEventListener("submit", event => {
      event.preventDefault();
      const form = event.currentTarget, data = new FormData(form);
      const name = data.get("newItemName").trim();
      const price = Number(data.get("newItemPrice"));
      const category = data.get("newItemCategory");
      if (!name || !Number.isFinite(price) || price < 1) return;
      const id = "custom-" + Date.now().toString(36);
      const menu = getMenu();
      menu.push({ id, name, price, category, description: "A freshly prepared Brew Bliss favourite.", image: fallbackImages[category] || fallbackImages.coffee });
      if (setMenu(menu)) { form.reset(); render(); }
    });
    list.addEventListener("click", event => {
      const button = event.target.closest("[data-delete-menu]");
      if (!button) return;
      const id = button.dataset.deleteMenu;
      if (!confirm("Remove this item from the menu? Existing cart items are not changed.")) return;
      setMenu(getMenu().filter(item => item.id !== id)); render();
    });
    document.getElementById("resetMenuBtn").addEventListener("click", () => {
      if (!confirm("Reset the menu to the original demo items?")) return;
      localStorage.removeItem(STORAGE.menu); render();
    });
    document.getElementById("clearOrdersBtn").addEventListener("click", () => {
      if (!confirm("Clear all demo orders saved in this browser?")) return;
      saveJSON(STORAGE.orders, []); render();
    });
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupFooter();
    updateCartCount();
    renderMenu();
    renderCart();
    renderCheckout();
    renderAdmin();
  });
})();
