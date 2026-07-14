const collections = {
    women: [
        { id: 1, image: "images/g1.jpg", title: "Blue Straight Dress", price: 19.99 },
        { id: 2, image: "images/g2.jpg", title: "Tube Dress", price: 29.99 },
        { id: 3, image: "images/g3.jpg", title: "Two Piece Dress", price: 15.50 },
        { id: 4, image: "images/g4.jpg", title: "Brown Dinner Dress", price: 25.00 },
        { id: 5, image: "images/g5.jpg", title: "Beach Dress", price: 18.75 },
        { id: 6, image: "images/g6.jpg", title: "Black Free Dress", price: 40.00 },
        { id: 7, image: "images/g7.jpg", title: "Bodycon White Dress", price: 22.10 },
        { id: 8, image: "images/g8.jpg", title: "Bodycon White Cherry Dress", price: 35.99 },

    ],

    men: [
        { id: 9, image: "images/b1.jpg", title: "Knitted Short Sleeve Shirt", price: 21.99 },
        { id: 10, image: "images/b2.jpg", title: "Flannel Shirt", price: 28.50 },
        { id: 11, image: "images/b3.jpg", title: "Brown Shirt", price: 16.00 },
        { id: 12, image: "images/b4.jpg", title: "Plain Round Neck", price: 33.00 },
        { id: 13, image: "images/b5.jpg", title: "VIP Knitted Shirt", price: 19.99 },
        { id: 14, image: "images/b6.jpg", title: "Summer Shirt", price: 45.00 },
        { id: 15, image: "images/b7.jpg", title: "Grey Executive Suit", price: 200.30 },
        { id: 16, image: "images/b8.jpg", title: "Peach Executive Suit", price: 200.99 }
    ],

    kids: [
        { id: 17, image: "images/k1.jpg", title: "Red Princess Dress", price: 10.00 },
        { id: 18, image: "images/k2.jpg", title: "Two piece knitted Dress", price: 12.50 },
        { id: 19, image: "images/k3.jpg", title: "Pink Princess Dress", price: 9.99 },
        { id: 20, image: "images/k4.jpg", title: "Grey Princess Dress", price: 14.00 },
        { id: 21, image: "images/k5.jpg", title: "White & Olive Dress", price: 11.75 },
        { id: 22, image: "images/k6.jpg", title: "Orange & Yellow beige Dress", price: 16.00 },
        { id: 23, image: "images/k7.jpg", title: "Blue Textured Kid Shirt", price: 13.30 },
        { id: 24, image: "images/k8.jpg", title: "Light Teal Kid Shirt", price: 18.99 }
    ]
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || null;

/* INITIALIZATION */
document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    updateCartUI();
    updateAuthUI();
});

/* RENDER PRODUCTS TO GRIDS */
function renderAll() {
    renderGrid("women-grid", collections.women);
    renderGrid("men-grid", collections.men);
    renderGrid("kids-grid", collections.kids);
    
    // Show all categories on complete clear
    if (document.getElementById("women-clothes")) document.getElementById("women-clothes").style.display = "block";
    if (document.getElementById("men-clothes")) document.getElementById("men-clothes").style.display = "block";
    if (document.getElementById("kid")) document.getElementById("kid").style.display = "block";
}

function renderGrid(id, items) {
    const grid = document.getElementById(id);
    if (!grid) return;
    grid.innerHTML = "";

    items.forEach(product => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" class="product-img">
                <h3>${product.title}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <div style="margin: 8px 0;">
                    <label for="size-${product.id}">Size: </label>
                    <select id="size-${product.id}" class="size-select">
                        <option value="S">S</option>
                        <option value="M" selected>M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    });
}

// Client-Side JavaScript Array Search Engine with Category Handling
function searchLocalArray() {
    const query = document.getElementById("searchBar").value.toLowerCase().trim();

    if (query === "") {
        renderAll();
        return;
    }

    const filteredWomen = collections.women.filter(item => item.title.toLowerCase().includes(query));
    const filteredMen = collections.men.filter(item => item.title.toLowerCase().includes(query));
    const filteredKids = collections.kids.filter(item => item.title.toLowerCase().includes(query));

    renderGrid("women-grid", filteredWomen);
    renderGrid("men-grid", filteredMen);
    renderGrid("kids-grid", filteredKids);

    // Dynamic Visibility Toggle: Hides entire sections if no matching items are returned
    if (document.getElementById("women-clothes")) document.getElementById("women-clothes").style.display = filteredWomen.length > 0 ? "block" : "none";
    if (document.getElementById("men-clothes")) document.getElementById("men-clothes").style.display = filteredMen.length > 0 ? "block" : "none";
    if (document.getElementById("kid")) document.getElementById("kid").style.display = filteredKids.length > 0 ? "block" : "none";
}

/* CART OPERATION FLOWS */
function addToCart(id) {
    let product = findProduct(id);
    const sizeElement = document.getElementById(`size-${id}`);
    const selectedSize = sizeElement ? sizeElement.value : "M";

    let existing = cart.find(item => item.id === id && item.size === selectedSize);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1, size: selectedSize });
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(id, size) {
    cart = cart.filter(item => !(item.id === id && item.size === size));
    saveCart();
    updateCartUI();
}

/* FUSED CHANGE: QUANTITY INCREMENT & DECREMENT CONTROL */
function changeQuantity(id, size, delta) {
    let existing = cart.find(item => item.id === id && item.size === size);
    if (existing) {
        existing.quantity += delta;
        if (existing.quantity <= 0) {
            removeFromCart(id, size);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function findProduct(id) {
    return [...collections.women, ...collections.men, ...collections.kids].find(p => p.id === id);
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* UI MANAGEMENT */
/* UPDATED CART SIDEBAR UI WITH PLUS/MINUS INCREMENT CONTROLS */
function updateCartUI() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    if (!cartItems) return;

    cartItems.innerHTML = "";
    let totalCount = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalCount += item.quantity;
        const itemSubtotal = item.price * item.quantity;
        totalPrice += itemSubtotal;

        cartItems.innerHTML += `
            <div class="cart-item" style="display: flex; gap: 10px; margin-bottom: 12px; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <img src="${item.image}" class="cart-img" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0; font-size: 14px;">${item.title} (<strong style="color: #EF8F00;">${item.size}</strong>)</h4>
                    <p style="margin: 2px 0; font-size: 13px; color: #666;">$${item.price.toFixed(2)} each</p>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 5px;">
                        <button onclick="changeQuantity(${item.id}, '${item.size}', -1)" style="background:#eee; border:none; padding: 2px 8px; cursor:pointer; font-weight:bold; border-radius:3px;">-</button>
                        <span style="font-weight: bold; font-size: 14px;">${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, '${item.size}', 1)" style="background:#eee; border:none; padding: 2px 8px; cursor:pointer; font-weight:bold; border-radius:3px;">+</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: bold; margin: 0; font-size: 14px; color: #333;">$${itemSubtotal.toFixed(2)}</p>
                    <button onclick="removeFromCart(${item.id}, '${item.size}')" class="remove-btn" style="background: none; border: none; color: #d9534f; cursor: pointer; font-size: 12px; margin-top: 5px; padding: 0;">Remove</button>
                </div>
            </div>
        `;
    });

    if (cartCount) cartCount.textContent = totalCount;

    cartItems.innerHTML += `
        <div style="margin-top:10px; border-top:1px dashed #ccc; padding-top:10px; text-align: right;">
            <h3>Total: $${totalPrice.toFixed(2)}</h3>
        </div>
    `;
}

function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("active");
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();

    const body = document.getElementById("checkoutBody");
    const total = document.getElementById("checkoutTotal");

    if (body) body.innerHTML = "";
    if (total) total.textContent = "Grand Total: $0.00";
}

/* AUTH UI & DASHBOARD CONTROLLERS */

// 1. Decides whether to route user to Dashboard or send them to the login page.
// The old popup sign-in/sign-up modal has been replaced by dedicated pages
// (login.html / new account.html) - see those files for the actual auth form logic.
function handleAuthClick() {
    if (currentUser) {
        openDashboardModal();
    } else {
        window.location.href = "login.html";
    }
}

// 2. Open Dashboard and populate user telemetry dynamically
function openDashboardModal() {
    if (!currentUser) return;
    
    document.getElementById("dashName").textContent = currentUser.name;
    document.getElementById("dashPhone").textContent = currentUser.phone;
    
    // Fallback default status to 'Pending' if an admin hasn't structuralized it yet
    const currentStatus = currentUser.orderStatus || "Pending";
    const statusBadge = document.getElementById("dashStatusBadge");
    statusBadge.textContent = currentStatus;
    
    // Dynamic color engine matching the admin decisions
    if (currentStatus === "Verified") {
        statusBadge.style.background = "#28a745"; // Vibrant Green
    } else if (currentStatus === "Rejected/Canceled") {
        statusBadge.style.background = "#dc3545"; // Crimson Red
    } else {
        statusBadge.style.background = "#EF8F00"; // QuadShop Amber Orange for Pending
    }
    
    document.getElementById("dashboardModal").style.display = "flex";
}

function closeDashboardModal() {
    document.getElementById("dashboardModal").style.display = "none";
}

// 3. Modifies the navigation layout state to reflect global access management variables
function updateAuthUI() {
    const statusBtn = document.getElementById("auth-status-btn");
    if (!statusBtn) return;

    if (currentUser) {
        // Safely extract initials only when a user is logged in
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        statusBtn.textContent = `Hi, ${initials}`;
        statusBtn.style.background = "#0038BC"; // Corporate blue accent
    } else {
        statusBtn.innerHTML = `<i class="fas fa-user-circle"></i>`;
        statusBtn.style.background = "#EF8F00"; // Base highlight amber
    }
}

// 4. Clears session memory and resets application view layer state
function processLogout() {
    if (confirm("Are you sure you want to log out of QuadShop?")) {
        currentUser = null;
        sessionStorage.removeItem("currentUser"); // Destroys the active session cache
        closeDashboardModal();
        updateAuthUI();
        alert("You have logged out successfully. Checkout is now locked.");
    }
}

/* SECRET ADMIN BACKEND SIMULATION ENGINE */
function openAdminPanel() {
    const adminTargetText = document.getElementById("adminTargetUser");
    if (!adminTargetText) return;
    
    if (currentUser) {
        adminTargetText.textContent = `${currentUser.name} (${currentUser.phone})`;
    } else {
        adminTargetText.textContent = "No user logged in currently";
    }
    document.getElementById("adminPanelModal").style.display = "flex";
}

function closeAdminPanel() {
    document.getElementById("adminPanelModal").style.display = "none";
}

function changeOrderStatus(newStatus) {
    if (!currentUser) {
        alert("There is no active user online to modify!");
        return;
    }

    // 1. Mutate status locally inside session instance string tracking 
    currentUser.orderStatus = newStatus;
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert(`Order status updated to: "${newStatus}"`);
    closeAdminPanel();

    // 2. Refresh dashboard instantly if open to demonstrate real-time change to panel defense
    if (document.getElementById("dashboardModal").style.display === "flex") {
        openDashboardModal();
    }
}

/* CHECKOUT SYSTEM MANAGERS */
function openCheckout() {
    if (!currentUser) {
        alert("Access Denied: You must create an account or log in to place an order!");
        window.location.href = "login.html";
        return;
    }
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    document.getElementById("checkoutModal").style.display = "flex";
    goToForm();
}

function closeCheckout() {
    document.getElementById("checkoutModal").style.display = "none";
}

function goToForm() {
    document.getElementById("checkout-step-form").style.display = "block";
    document.getElementById("checkout-step-preview").style.display = "none";
}

function goToPreview(event) {
    event.preventDefault();
    const name = document.getElementById("custName").value;
    const phone = document.getElementById("custPhone").value;
    const location = document.getElementById("custLocation").value;

    document.getElementById("prevName").textContent = name;
    document.getElementById("prevPhone").textContent = phone;
    document.getElementById("prevLocation").textContent = location;

    renderCheckoutTable();

    document.getElementById("checkout-step-form").style.display = "none";
    document.getElementById("checkout-step-preview").style.display = "block";
}

function renderCheckoutTable() {
    const body = document.getElementById("checkoutBody");
    const total = document.getElementById("checkoutTotal");
    if (!body || !total) return;

    body.innerHTML = "";
    let grandTotal = 0;

    cart.forEach(item => {
        let subtotal = item.price * item.quantity;
        grandTotal += subtotal;

        body.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td><strong style="color: #EF8F00;">${item.size}</strong></td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });
    total.innerHTML = `Grand Total: $${grandTotal.toFixed(2)}`;
}


/* 3. RECEIPT PREVIEW GENERATION & WHATSAPP DM DISPATCH ENGINE (Without Momo details) */
function downloadReceiptAndSendWhatsApp() {
    const receiptTemplate = document.querySelector(".receipt");
    if (!receiptTemplate) return;
    
    const receiptClone = receiptTemplate.cloneNode(true);
    const body = receiptClone.querySelector("#receipt-body");
    const totalEl = receiptClone.querySelector("#receipt-total");
    const numberEl = receiptClone.querySelector("#receipt-number");
    const dateEl = receiptClone.querySelector("#receipt-date");

    const name = document.getElementById("custName").value;
    const phone = document.getElementById("custPhone").value;
    const location = document.getElementById("custLocation").value;

    body.innerHTML = "";
    let grandTotal = 0;
    
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let shortCode = '';
    for (let i = 0; i < 5; i++) {
        shortCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const receiptId = "QS-" + shortCode;
    const orderDate = new Date().toLocaleString();
    const businessNumber = "233503900447"; 

    let whatsappMessage = ` *NEW ORDER PLACED!*\n`;
    whatsappMessage += ` *Order ID:* ${receiptId}\n`;
    whatsappMessage += ` *Date:* ${orderDate}\n\n`;
    whatsappMessage += `👤 *CUSTOMER DETAILS:*\n• *Name:* ${name}\n• *Phone:* ${phone}\n• *Location:* ${location}\n\n`;
    whatsappMessage += ` *ITEMS ORDERED:*\n`;

    let itemsSignatureString = "";
    const rows = cart.map((item, index) => {
        const subtotal = item.price * item.quantity;
        grandTotal += subtotal;

        whatsappMessage += `${index + 1}. *${item.title}* [Size: ${item.size}] (x${item.quantity}) - $${subtotal.toFixed(2)}\n`;
        itemsSignatureString += `${item.id}-${item.size}-${item.quantity}-${subtotal.toFixed(2)}|`;

        return `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.size}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    }).join("");

    body.innerHTML = rows;
    const finalTotalFormatted = grandTotal.toFixed(2);

    const SECRET_VERIFICATION_SALT = "QuadShopSuperSecretKey2026";
    const messageToHash = `${receiptId}-${finalTotalFormatted}-${itemsSignatureString}-${SECRET_VERIFICATION_SALT}`;
    const securityDigitalSignature = CryptoJS.SHA256(messageToHash).toString(CryptoJS.enc.Hex);

    if(receiptClone.querySelector("#rcpt-cust-name")) receiptClone.querySelector("#rcpt-cust-name").textContent = name;
    if(receiptClone.querySelector("#rcpt-cust-phone")) receiptClone.querySelector("#rcpt-cust-phone").textContent = phone;
    if(receiptClone.querySelector("#rcpt-cust-location")) receiptClone.querySelector("#rcpt-cust-location").textContent = location;

    if (numberEl) numberEl.textContent = "Order ID: " + receiptId;
    if (dateEl) dateEl.textContent = "Date: " + orderDate;
    if (totalEl) totalEl.textContent = "Total: $" + finalTotalFormatted;

    whatsappMessage += `\n *Grand Total:* $${finalTotalFormatted}\n\n`;
    whatsappMessage += ` *ITEMS MATRIX:*\n\`${itemsSignatureString}\`\n\n`;
    whatsappMessage += ` *SECURITY DIGITAL SIGNATURE:*\n\`${securityDigitalSignature}\`\n`;

    // ACTIVE ACCOUNT REFLECTIVE DATA PACKET 
    const databasePayload = {
        receipt_id: receiptId,
        user_id: currentUser ? currentUser.id : 0, 
        customer_name: name,
        customer_phone: phone, 
        customer_location: location,
        total_price: finalTotalFormatted,
        items_matrix: itemsSignatureString,
        crypto_hash: securityDigitalSignature
    };

    // Post order information to the dedicated customer-facing endpoint.
    // (Previously this hit admin_endpoints.php, which now requires an admin
    // login for its other actions and restricts CORS to http://localhost only -
    // if this page is ever opened from a different origin/port, that would
    // silently block every order from ever reaching the database. place_order.php
    // stays open/unauthenticated on purpose, since customers placing orders
    // aren't admins.)
    fetch('http://localhost/quadshop/place_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(databasePayload)
    })
    .then(res => res.json())
    .then(dbData => {
        if(dbData.success) {
            console.log("Order logged into MySQL database safely!");
            
            // Lock order references into client session context immediately
            // (status lookups now key off currentUser.id, not phone, so there's no
            // need to overwrite currentUser.phone with the checkout form value here.
            // Also corrected: currentUser lives in sessionStorage, not localStorage -
            // writing to localStorage here meant this update was never actually read
            // back by openDashboardModal() or the poller, which both read sessionStorage.)
            if (currentUser) {
                currentUser.orderStatus = "Pending";
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            // Kickstart real-time live status verification engine right away
            if (typeof startOrderStatusPoller === "function") {
                startOrderStatusPoller();
            }
        } else {
            console.error("Database Log Warning: " + dbData.message);
        }
    })
    .catch(err => console.error("Database connection dropped:", err));

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.background = "#fff";
    container.appendChild(receiptClone);
    document.body.appendChild(container);

    setTimeout(() => {
        html2pdf()
            .set({
                margin: 0.4,
                filename: `${receiptId}_Receipt.pdf`,
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            })
            .from(receiptClone)
            .save()
            .then(() => {
                document.body.removeChild(container);
                const encodedMessage = encodeURIComponent(whatsappMessage);
                window.open(`https://wa.me/${businessNumber}?text=${encodedMessage}`, '_blank');
                clearCart();
                closeCheckout();
            });
    }, 300);
}

/* LIVE ORDER TRACKING BACKGROUND CHECK ENGINE */
let lastKnownStatus = "Pending";

function startOrderStatusPoller() {
    setInterval(() => {
        // Poll using the account's own user_id, not the phone number typed at checkout.
        // (Previously this hit admin_endpoints.php, whose GET handler ignores query
        // params entirely and always returns the full order list, so data.success was
        // never set and the dashboard never updated. get_order_status.php is the
        // endpoint that actually filters, and it now keys off the real account id.)
        if (!currentUser || !currentUser.id) return;

        fetch(`http://localhost/quadshop/get_order_status.php?user_id=${currentUser.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.orderStatus) {
                    const currentLiveStatus = data.orderStatus;
                    
                    // If state has shifted on the admin dashboard, fire UI updates
                    if (currentLiveStatus !== lastKnownStatus) {
                        lastKnownStatus = currentLiveStatus;
                        currentUser.orderStatus = currentLiveStatus;
                        sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
                        
                        // Fire beautiful alert toast immediately
                        triggerLiveToast(currentLiveStatus);
                        
                        // Update the dashboard badge dynamically if the user has it open
                        if (document.getElementById("dashboardModal").style.display === "flex") {
                            openDashboardModal();
                        }
                    }
                }
            })
            .catch(err => console.warn("Polling system backend line down: ", err));
    }, 4000); // Polls database rows cleanly every 4 seconds
}

function triggerLiveToast(status) {
    const toast = document.getElementById("liveToastNotification");
    const icon = document.getElementById("toastIcon");
    const title = document.getElementById("toastTitle");
    const msg = document.getElementById("toastMessage");
    
    if (!toast) return;

    if (status === "Verified") {
        toast.style.backgroundColor = "#000000";
        icon.innerHTML = "✔";
        title.textContent = "Order Approved!";
        msg.textContent = "Your receipt is verified. Thank you for choosing QuadShop!";
    } else if (status === "Rejected/Canceled") {
        toast.style.backgroundColor = "#000000";
        icon.innerHTML = "✖";
        title.textContent = "Order Rejected";
        msg.textContent = "Your receipt has been rejected. Critical receipt tampering detected.";
    } else {
        toast.style.backgroundColor = "#EF8F00";
        icon.innerHTML = "⏳";
        title.textContent = "Order Reset";
        msg.textContent = "Your order status returned to pending verification.";
    }

    toast.style.display = "flex";
    setTimeout(() => {
        toast.style.display = "none";
    }, 6000);
}

// Register initialization sequence callback trigger loops
document.addEventListener("DOMContentLoaded", () => {
    if(currentUser) {
        lastKnownStatus = currentUser.orderStatus || "Pending";
    }
    startOrderStatusPoller();
});

/* RESPONSIVE MOBILE MENU INTERACTION CONTROLLER */
function toggleMobileMenu() {
    const navTabs = document.getElementById("navTabs");
    const menuIcon = document.querySelector(".menu-toggle i");
    
    if (!navTabs) return;
    
    // Toggle active state drawer layout
    navTabs.classList.toggle("active");
    
    // Smooth cosmetic shift: transforms hamburger icon to a clean close 'X' mark
    if (navTabs.classList.contains("active")) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-xmark");
    } else {
        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");
    }
}
