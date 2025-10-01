// GET cart from localStorage or empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// UPDATE cart value in navbar
function updateCartValue() {
  const cartValue = document.querySelector(".cart-value");
  cartValue.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

// ADD to cart buttons
function attachAddToCartHandlers() {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;

      const existing = cart.find(i => i.id === id);
      if (existing) existing.quantity++;
      else cart.push({ id, name, price, img, quantity: 1 });

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartValue();
      alert(`${name} added to cart!`);
    });
  });
}

// CART PAGE FUNCTIONS
function fetchCart() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCart(cart);
}

function renderCart(cart) {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const subtotalElem = document.getElementById("subtotal");
  const deliveryElem = document.getElementById("delivery-charge");
  const discountElem = document.getElementById("discount");
  const finalElem = document.getElementById("final-total");

  cartItems.innerHTML = "";
  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "";
    updateCartValue();
    subtotalElem.textContent = "Subtotal: $0";
    deliveryElem.textContent = "Delivery: $0";
    discountElem.textContent = "Discount: $0";
    finalElem.textContent = "Final Total: $0";
    return;
  }

  let subtotal = 0;
  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="details">
        <h4>${item.name}</h4>
        <p>$${item.price} × <span class="quantity">${item.quantity}</span></p>
        <div class="quantity-controls">
          <button onclick="updateQuantity(${index}, 'decrease')">-</button>
          <button onclick="updateQuantity(${index}, 'increase')">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
    `;
    cartItems.appendChild(div);
  });

  const delivery = subtotal > 0 ? 50 : 0;
  const discount = 0;
  const finalTotal = subtotal - discount + delivery;

  subtotalElem.textContent = "Subtotal: $" + subtotal.toFixed(2);
  deliveryElem.textContent = "Delivery: $" + delivery.toFixed(2);
  discountElem.textContent = "Discount: $" + discount.toFixed(2);
  finalElem.textContent = "Final Total: $" + finalTotal.toFixed(2);

  updateCartValue();
}

function updateQuantity(index, action) {
  if (action === "increase") cart[index].quantity++;
  if (action === "decrease" && cart[index].quantity > 1) cart[index].quantity--;
  localStorage.setItem("cart", JSON.stringify(cart));
  fetchCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  fetchCart();
}

// PLACE ORDER
async function placeOrder() {
  const user = JSON.parse(localStorage.getItem("foodie_current_user"));
  if (!user) return alert("Please login first!");

  const address = document.getElementById("address").value;
  if (!address) return alert("Select delivery address.");

  if (!cart.length) return alert("Cart is empty!");

  const orderData = {
    userId: user.id,
    deliveryAddress: address,
    couponCode: null,
    paymentMethod: document.querySelector('input[name="payment"]:checked').value,
    items: cart.map(i => ({ productId: i.id, quantity: i.quantity }))
  };

  try {
    const res = await fetch("http://localhost:8080/orders/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", text);
      return alert("Failed to place order: " + text);
    }

    const data = await res.json();
    alert("Order placed successfully! Order ID: " + data.id);

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    fetchCart();
  } catch (err) {
    console.error(err);
    alert("Failed to place order. Try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCart();
  updateCartValue();
  document.getElementById("placeOrderBtn")?.addEventListener("click", placeOrder);
});
