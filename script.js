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

    // State
    let cart = [];

    // Functions
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
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

        // Log to console (dummy data)
        console.log('Order Data (Dummy):', formData);

        // Close checkout and show success
        checkoutModal.classList.remove('active');
        successModal.classList.add('active');

        // Clear cart after successful order
        cart = [];
        updateCartUI();
    }

    function closeSuccess() {
        successModal.classList.remove('active');
        checkoutForm.reset();
    }

    // Event Listeners
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    overlay.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', openCheckout);
    closeCheckoutBtn.addEventListener('click', closeCheckout);
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    closeSuccessBtn.addEventListener('click', closeSuccess);

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = e.target.getAttribute('data-price');
            addToCart(name, price);
        });
    });
});