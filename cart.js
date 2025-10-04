// cart.js

// ---------- Storage / state ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Utility to persist cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ---------- Navbar cart count ----------
function updateCartValue() {
  const cartValueElem = document.querySelector(".cart-value");
  if (!cartValueElem) return;
  const total = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);
  cartValueElem.textContent = total;
}

// ---------- Add-to-cart handler (used by menu.html) ----------
function attachAddToCartHandlers() {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    if (btn._attached) return; // avoid double-binding
    btn._attached = true;

    btn.addEventListener("click", () => {

       const user = JSON.parse(localStorage.getItem("foodie_current_user"));
  if (!user || !user.id) {
    alert("Please login first to add items to cart!");
    window.location.href = "sign.html"; // redirect to login page
    return;
  }
      // required dataset attributes
      const idRaw = btn.dataset.id;
      const id = idRaw ? (isNaN(idRaw) ? idRaw : Number(idRaw)) : null;
      const name = btn.dataset.name || "Unknown";
      const price = parseFloat(btn.dataset.price) || 0;
      const img = btn.dataset.img || "";

      if (id === null || id === undefined) {
        console.error("Add-to-cart clicked but button has no data-id:", btn);
        return alert("Item missing id — can't add to cart. Check console.");
      }

      // find existing by id
      const existing = cart.find(x => x.id === id);
      if (existing) existing.quantity = (existing.quantity || 0) + 1;
      else cart.push({ id, name, price, img, quantity: 1 });

      saveCart();
      updateCartValue();
      alert(`${name} added to cart!`);
    });
  });
}

// ---------- Cart page rendering ----------
function fetchCart() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const subtotalElem = document.getElementById("subtotal");
  const deliveryElem = document.getElementById("delivery-charge");
  const discountElem = document.getElementById("discount");
  const finalElem = document.getElementById("final-total");

  if (!cartItems) return;

  cartItems.innerHTML = "";
  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    if (cartTotal) cartTotal.textContent = "";
    if (subtotalElem) subtotalElem.textContent = "Subtotal: $0";
    if (deliveryElem) deliveryElem.textContent = "Delivery: $0";
    if (discountElem) discountElem.textContent = "Discount: $0";
    if (finalElem) finalElem.textContent = "Final Total: $0";
    updateCartValue();
    return;
  }

  let subtotal = 0;
  cart.forEach((item, idx) => {
    subtotal += (item.price || 0) * (item.quantity || 0);

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.img || ""}" alt="${item.name || ""}">
      <div class="details">
        <h4>${item.name || ""}</h4>
        <p>$${(item.price || 0).toFixed(2)} × <span class="quantity">${item.quantity}</span></p>
        <div class="quantity-controls">
          <button data-idx="${idx}" data-action="decrease">-</button>
          <button data-idx="${idx}" data-action="increase">+</button>
        </div>
      </div>
      <button class="remove-btn" data-idx="${idx}">Remove</button>
    `;
    cartItems.appendChild(itemDiv);
  });

  // attach quantity / remove handlers (delegation)
  cartItems.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = Number(btn.dataset.idx);
      const action = btn.dataset.action;
      if (action === "increase") cart[i].quantity = (cart[i].quantity || 0) + 1;
      if (action === "decrease" && cart[i].quantity > 1) cart[i].quantity--;
      saveCart();
      renderCart();
      updateCartValue();
    });
  });
  cartItems.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.idx);
      cart.splice(i, 1);
      saveCart();
      renderCart();
      updateCartValue();
    });
  });

  const delivery = subtotal > 0 ? 50 : 0;
  const discount = 0; // you can compute based on coupon if you want
  const finalTotal = subtotal - discount + delivery;

  if (cartTotal) cartTotal.textContent = `Total: $${subtotal.toFixed(2)}`;
  if (subtotalElem) subtotalElem.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  if (deliveryElem) deliveryElem.textContent = `Delivery: $${delivery.toFixed(2)}`;
  if (discountElem) discountElem.textContent = `Discount: $${discount.toFixed(2)}`;
  if (finalElem) finalElem.textContent = `Final Total: $${finalTotal.toFixed(2)}`;

  updateCartValue();
}

// ---------- Address helpers (allow typing) ----------
function loadAddresses() {
  // If the page uses <select id="address"> we keep it but add "Other" option
  const addressSelect = document.getElementById("address");
  if (!addressSelect) return;

  // clear and add "Enter address" + "Other"
  addressSelect.innerHTML = "";
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "Select or type address";
  addressSelect.appendChild(defaultOpt);

  const saved = JSON.parse(localStorage.getItem("foodie_addresses")) || [];
  saved.forEach(addr => {
    const opt = document.createElement("option");
    opt.value = addr;
    opt.textContent = addr;
    addressSelect.appendChild(opt);
  });

  const otherOpt = document.createElement("option");
  otherOpt.value = "other";
  otherOpt.textContent = "Enter address manually";
  addressSelect.appendChild(otherOpt);

  // create manual input (hidden initially)
  if (!document.getElementById("address_manual")) {
    const manual = document.createElement("input");
    manual.id = "address_manual";
    manual.placeholder = "Type your full address here";
    manual.style.display = "none";
    manual.style.marginTop = "8px";
    addressSelect.parentNode.appendChild(manual);
  }

  addressSelect.addEventListener("change", function () {
    const manual = document.getElementById("address_manual");
    if (this.value === "other") {
      manual.style.display = "block";
      manual.focus();
    } else {
      if (manual) {
        manual.style.display = "none";
        manual.value = "";
      }
    }
  });
}

function getAddressValue() {
  const sel = document.getElementById("address");
  const manual = document.getElementById("address_manual");
  if (!sel) return (manual && manual.value) ? manual.value.trim() : "";
  if (sel.value === "other") return (manual && manual.value) ? manual.value.trim() : "";
  return sel.value || (manual && manual.value) || "";
}

// ---------- Place order (main) ----------
async function placeOrder() {
  try {
    // current cart from storage
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    // user must be logged in and must have id
    const user = JSON.parse(localStorage.getItem("foodie_current_user"));
    if (!user || (!user.id && !user.userId)) {
      return alert("Please login first!");
    }
    // const userId = user.id ?? user.userId; 

    const userId = user.id;

    if (!cart.length) return alert("Cart is empty!");

    const address = getAddressValue();
    if (!address) return alert("Please select or type delivery address.");

    // ensure every cart item has an id to map to productId
    for (const it of cart) {
      if (it.id === undefined || it.id === null) {
        console.error("Cart item missing id:", it, "Full cart:", cart);
        return alert("Cart contains item without product id. Please re-add items from menu.");
      }
    }

    const items = cart.map(i => ({ productId: Number(i.id), quantity: Number(i.quantity) }));

    const orderData = {
      // backend controller uses path userId, so we DON'T need to send userId in body, but backend will accept either
      // userId: userId,
      deliveryAddress: address,
      couponCode: null,
      paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || "cod",
      items
    };

    console.log("Sending order to backend:", orderData);

    // NOTE: controller mapping expects /orders/place/{userId}
   const url = `http://localhost:8080/orders/place/${userId}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    // helpful debug output if server replies non-OK
    if (!res.ok) {
      // try to parse JSON message first, fallback to text
      let bodyText;
      try {
        bodyText = await res.text();
      } catch (e) {
        bodyText = "Could not read response body";
      }
      console.error("Order failed — HTTP", res.status, bodyText);
      alert("Failed to place order: " + (bodyText || `HTTP ${res.status}`));
      return;
    }

    // success
    const data = await res.json();
    console.log("Order placed OK:", data);
    alert("Order placed successfully! Order ID: " + (data.id ?? data.orderId ?? "N/A"));

    // clear cart
    cart = [];
    saveCart();
    renderCart();
    updateCartValue();
  } catch (err) {
    console.error("Place order exception:", err);
    alert("Failed to place order. Check console/network tab for details.");
  }
}

// ---------- Init on pages ----------
document.addEventListener("DOMContentLoaded", () => {
  // If this script is included on menu page, attach handlers and update counter
  attachAddToCartHandlers();
  updateCartValue();

  // If on cart page, render cart and wire place order button
  fetchCart();
  loadAddresses(); // prepare select + manual input
  const placeBtn = document.getElementById("placeOrderBtn");
  if (placeBtn) placeBtn.addEventListener("click", placeOrder);
});

// expose some functions globally so menu.html can call them if needed
window.attachAddToCartHandlers = attachAddToCartHandlers;
window.updateCartValue = updateCartValue;
window.fetchCart = fetchCart;
window.placeOrder = placeOrder;
