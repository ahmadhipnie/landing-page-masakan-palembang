document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.querySelector('.cart-count');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const summaryItemsContainer = document.getElementById('summary-items');
    const summaryTotalElement = document.getElementById('summary-total');
    const successModal = document.getElementById('success-modal');
    const closeSuccessBtn = document.getElementById('close-success');
    const viewHistoryBtn = document.getElementById('view-history');
    const clearOrdersBtn = document.getElementById('clear-orders');
    const ordersSidebar = document.getElementById('orders-sidebar');
    const closeOrdersSidebarBtn = document.getElementById('close-orders-sidebar');
    const navHistory = document.getElementById('nav-history');

    // State
    let cart = [];

    function toggleOrdersSidebar() {
        ordersSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    function renderOrdersSidebar() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const container = document.getElementById('orders-list');
        if (!container) return;
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#777;margin-top:1.5rem;">Belum ada pesanan.</p>';
            return;
        }

        orders.slice().reverse().forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div style="font-weight:600">${order.id}</div>
                    <div style="font-size:0.85rem;color:#777">Rp ${order.total.toLocaleString('id-ID')}</div>
                </div>
                <div style="font-size:0.85rem;color:#777;margin-top:0.25rem">${new Date(order.date).toLocaleString('id-ID')}</div>
                <div class="order-items-scroll" style="margin-top:0.4rem;font-size:0.9rem">${order.items.map(i => `<div class="order-item-line">${i.name} x${i.quantity}</div>`).join('')}</div>
            `;
            container.appendChild(card);
        });
    }

    // Functions
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    function closeAllOverlays() {
        cartSidebar.classList.remove('active');
        checkoutModal.classList.remove('active');
        successModal.classList.remove('active');
        overlay.classList.remove('active');
        ordersSidebar.classList.remove('active');
    }

    function updateCartUI() {
        // Update Count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;

        // Update Total Price
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;

        // Render Items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Keranjang masih kosong</div>';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}</p>
                </div>
                <div class="cart-item-total">
                    Rp ${(item.price * item.quantity).toLocaleString('id-ID')}
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: parseInt(price),
                quantity: 1
            });
        }

        updateCartUI();
        
        // Open cart to show feedback
        if (!cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    }

    function openCheckout() {
        if (cart.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }

        // Update checkout summary
        summaryItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const summaryItem = document.createElement('div');
            summaryItem.classList.add('summary-item');
            summaryItem.innerHTML = `
                <span class="summary-item-name">${item.name}</span>
                <span class="summary-item-qty">x${item.quantity}</span>
                <span class="summary-item-price">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
            `;
            summaryItemsContainer.appendChild(summaryItem);
        });

        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        summaryTotalElement.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;

        // Close cart and open checkout
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        checkoutModal.classList.add('active');
    }

    function closeCheckout() {
        checkoutModal.classList.remove('active');
        checkoutForm.reset();
    }

    function handleCheckoutSubmit(e) {
        e.preventDefault();

        // Get form data (dummy - not actually sent anywhere)
        const formData = {
            name: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            address: document.getElementById('customer-address').value,
            notes: document.getElementById('customer-notes').value,
            payment: document.querySelector('input[name="payment"]:checked').value,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };

        // Create order object with ID and timestamp
        const orderId = 'ORD-' + Date.now();
        const order = {
            id: orderId,
            date: new Date().toISOString(),
            ...formData
        };

        // Save to localStorage (dummy persistence)
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        // Log to console (dummy data)
        console.log('Order Data (Dummy):', order);

        // Close checkout and show success
        checkoutModal.classList.remove('active');
        document.getElementById('order-id-msg').textContent = `Nomor pesanan: ${orderId}`;
        successModal.classList.add('active');

        // Clear cart after successful order
        cart = [];
        updateCartUI();

        // Update orders list if visible
        renderOrders();
    }

    // Orders helpers
    function formatDate(iso) {
        const d = new Date(iso);
        return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    }
    
    function renderOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const container = document.getElementById('orders-list');
        if (!container) return; // page may not have orders section
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#777;margin-top:2rem;">Belum ada pesanan.</p>';
            return;
        }

        orders.slice().reverse().forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div class="order-header">
                    <div>
                        <strong>${order.id}</strong>
                        <div class="order-date">${formatDate(order.date)}</div>
                    </div>
                    <div class="order-total">Rp ${order.total.toLocaleString('id-ID')}</div>
                </div>
                <div class="order-body">
                    <div><strong>${order.name}</strong> • ${order.phone}</div>
                    <div class="order-address">${order.address}</div>
                    <ul class="order-items">
                        ${order.items.map(i => `<li>${i.name} x${i.quantity} — Rp ${(i.price * i.quantity).toLocaleString('id-ID')}</li>`).join('')}
                    </ul>
                    <div class="order-payment">Metode: ${order.payment}</div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    if (clearOrdersBtn) {
        clearOrdersBtn.addEventListener('click', () => {
            if (!confirm('Hapus semua riwayat pesanan?')) return;
            localStorage.removeItem('orders');
            renderOrders();
            renderOrdersSidebar();
        });
    }

    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            renderOrdersSidebar();
            toggleOrdersSidebar();
        });
    }
    
    if (navHistory) {
        navHistory.addEventListener('click', (e) => {
            e.preventDefault();
            renderOrdersSidebar();
            toggleOrdersSidebar();
        });
    }
    
    if (closeOrdersSidebarBtn) {
        closeOrdersSidebarBtn.addEventListener('click', () => {
            ordersSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // Initialize orders on load
    renderOrders();
    renderOrdersSidebar();

    function closeSuccess() {
        successModal.classList.remove('active');
        checkoutForm.reset();
    }

    // Event Listeners
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    overlay.addEventListener('click', closeAllOverlays);
    checkoutBtn.addEventListener('click', openCheckout);
    closeCheckoutBtn.addEventListener('click', closeCheckout);
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    closeSuccessBtn.addEventListener('click', closeSuccess);

    // Close modals/sidebars when clicking navigation links (smooth experience)
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    navAnchors.forEach(a => {
        // Skip the Riwayat link since it manages its own behavior
        if (a.id === 'nav-history') return;
        a.addEventListener('click', () => {
            // Let default anchor behavior happen (scroll), but ensure UI clean
            closeAllOverlays();
        });
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = e.target.getAttribute('data-price');
            addToCart(name, price);
        });
    });
});