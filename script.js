// ======== ADD TO CART FUNCTIONALITY ========
document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const productName = card.dataset.product;
        const productPrice = card.querySelector(".price .current").innerText;
        const productImg = card.querySelector("img").src;

        // Get cart from localStorage or initialize
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if product already exists in cart
        let existing = cart.find(item => item.name === productName);
        if(existing) {
            existing.qty = (existing.qty || 1) + 1; // Increment qty
        } else {
            cart.push({name: productName, price: productPrice, img: productImg, qty: 1});
        }

        // Save updated cart
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update header cart count
        updateCartCount();

        // Show popup
        let popup = document.getElementById("cart-popup");
        if(popup){
            popup.style.display = "block";
            setTimeout(() => popup.style.display = "none", 1800);
        } else {
            alert(`${productName} added to cart!`);
        }
    });
});

// ======== UPDATE CART COUNT IN HEADER ========
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCountEl = document.getElementById("cart-count");
    if(cartCountEl) cartCountEl.innerText = cart.length;
}

// ======== CART PAGE FUNCTIONALITY ========
function displayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");

    if(!cartItems) return; // Do nothing if cart page not loaded

    cartItems.innerHTML = "";
    let total = 0;

    if(cart.length === 0){
        cartItems.innerHTML = "<p>Your cart is empty!</p>";
        if(totalPriceEl) totalPriceEl.innerText = "0";
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price.replace("$","")) * (item.qty || 1);
        total += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" />
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Price: ${item.price}</p>
                    <label>Qty: 
                        <input type="number" min="1" value="${item.qty || 1}" data-index="${index}" class="qty-input">
                    </label>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
    });

    if(totalPriceEl) totalPriceEl.innerText = total.toFixed(2);

    // Remove item functionality
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = btn.dataset.index;
            cart.splice(idx, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartCount();
        });
    });

    // Quantity change functionality
    document.querySelectorAll(".qty-input").forEach(input => {
        input.addEventListener("change", () => {
            const idx = input.dataset.index;
            let val = parseInt(input.value);
            if(val < 1) val = 1;
            cart[idx].qty = val;
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartCount();
        });
    });
}

// ======== INITIALIZE ========
updateCartCount();
displayCart();
