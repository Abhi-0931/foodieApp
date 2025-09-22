// Get cart from localStorage or create empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart number in navbar
function updateCartValue() {
  const cartValue = document.querySelector(".cart-value");
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartValue.textContent = totalItems;
}
updateCartValue();

// Add to Cart button event
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const img = button.dataset.img;

    // Check if item exists
    let existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, img, quantity: 1 });
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update number
    updateCartValue();
  });
});
