// Menu Data
const menuItems = {
  coffee: [
    {name:"Espresso", price:120, img:"https://images.unsplash.com/photo-1510626176961-4b57d4fbad03"},
    {name:"Cappuccino", price:150, img:"https://images.unsplash.com/photo-1527169402691-a3fb1e1e3d4a"},
    {name:"Latte", price:160, img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93"}
  ],
  snacks: [
    {name:"Chocolate Muffin", price:80, img:"https://images.unsplash.com/photo-1589367920942-3883c64bf3c7"},
    {name:"Cheese Croissant", price:100, img:"https://images.unsplash.com/photo-1585238342024-78fdd8b48e23"}
  ],
  specials: [
    {name:"Caramel Frappe", price:200, img:"https://images.unsplash.com/photo-1582454708390-2d01f19148b5"},
    {name:"Mocha Delight", price:180, img:"https://images.unsplash.com/photo-1527169402691-a3fb1e1e3d4a"}
  ]
};

// Save cart to localStorage
function getCart(){ return JSON.parse(localStorage.getItem("cart")) || []; }
function saveCart(cart){ localStorage.setItem("cart", JSON.stringify(cart)); }

// Home page menu
if(document.getElementById("menuGrid")){
  const menuGrid=document.getElementById("menuGrid");
  const tabs=document.querySelectorAll(".tab");
  const cartCount=document.getElementById("cartCount");

  function loadMenu(category){
    menuGrid.innerHTML="";
    menuItems[category].forEach(item=>{
      menuGrid.innerHTML+=`
        <div class="card">
          <img src="${item.img}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p class="price">₹${item.price}</p>
          <button class="order-btn" onclick="addToCart('${item.name}',${item.price})">Add to Cart</button>
        </div>`;
    });
  }
  loadMenu("coffee");

  tabs.forEach(tab=>{
    tab.addEventListener("click",()=>{
      document.querySelector(".tab.active").classList.remove("active");
      tab.classList.add("active");
      loadMenu(tab.dataset.category);
    });
  });

  function updateCartCount(){
    const cart=getCart();
    cartCount.innerText=cart.length;
  }
  updateCartCount();

  window.addToCart=function(name,price){
    const cart=getCart();
    cart.push({name,price});
    saveCart(cart);
    updateCartCount();
    alert(name+" added to cart!");
  }
}

// Cart page
if(document.getElementById("cartItems")){
  const cartItemsDiv=document.getElementById("cartItems");
  const cartTotal=document.getElementById("cartTotal");
  const cart=getCart();
  let total=0;
  cartItemsDiv.innerHTML=cart.map(item=>{
    total+=item.price;
    return `<p>${item.name} - ₹${item.price}</p>`;
  }).join("");
  cartTotal.innerText="₹"+total;
}

// Order page
if(document.getElementById("orderForm")){
  document.getElementById("orderForm").addEventListener("submit", e=>{
    e.preventDefault();
    localStorage.removeItem("cart"); // clear cart after order
    document.getElementById("orderMessage").innerText="✅ Your order has been placed!";
  });
}
