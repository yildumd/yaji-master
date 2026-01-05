// ===== SHOPPING CART FUNCTIONALITY =====

// Helper Functions
function formatPrice(price) {
    return `₦${price.toLocaleString('en-NG')}`;
}

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (!cartCountElement) return;
    
    const cart = JSON.parse(localStorage.getItem('yajiCart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
}

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
    
    // Close button event
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Cart object structure
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('yajiCart')) || [];
        this.init();
    }
    
    init() {
        this.loadCartItems();
        this.setupEventListeners();
        this.setupCartToggle();
        updateCartCount();
    }
    
    // Load cart items into sidebar
    loadCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');
        
        if (!cartItemsContainer) return;
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="btn btn-outline">Continue Shopping</a>
                </div>
            `;
            if (cartTotalElement) cartTotalElement.textContent = '₦0';
            return;
        }
        
        let cartHTML = '';
        let total = 0;
        
        this.cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-img" style="background: ${item.color || '#d4a574'};">
                        <span>${item.size.charAt(0)}</span>
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name} - ${item.size}</h4>
                        <p class="cart-item-price">${formatPrice(item.price)} × ${item.quantity}</p>
                        <p class="cart-item-subtotal">${formatPrice(itemTotal)}</p>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus-btn">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-btn plus-btn">+</button>
                            <button class="remove-item">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        if (cartTotalElement) cartTotalElement.textContent = formatPrice(total);
        
        // Add event listeners to cart item controls
        this.addCartItemEventListeners();
    }
    
    // Add event listeners to cart items
    addCartItemEventListeners() {
        // Plus buttons
        document.querySelectorAll('.plus-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.closest('.cart-item').dataset.index;
                this.updateQuantity(index, 1);
            });
        });
        
        // Minus buttons
        document.querySelectorAll('.minus-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.closest('.cart-item').dataset.index;
                this.updateQuantity(index, -1);
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.closest('.cart-item').dataset.index;
                this.removeItem(index);
            });
        });
    }
    
    // Setup event listeners for add to cart buttons
    setupEventListeners() {
        // Add to cart buttons on product pages
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get product data from data attributes
                const productId = button.dataset.id;
                const productName = button.dataset.name;
                const productPrice = parseInt(button.dataset.price);
                const productSize = button.dataset.size;
                const productColor = button.dataset.color;
                
                // Get quantity (default to 1 if not on product page)
                let quantity = 1;
                const quantityInput = document.querySelector('.quantity-input');
                if (quantityInput) {
                    quantity = parseInt(quantityInput.value) || 1;
                }
                
                this.addItem({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    size: productSize,
                    color: productColor,
                    quantity: quantity
                });
            });
        });
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
    }
    
    // Setup cart toggle functionality
    setupCartToggle() {
        const cartIcon = document.getElementById('cartIcon');
        const closeCart = document.getElementById('closeCart');
        const cartSidebar = document.getElementById('cartSidebar');
        
        if (cartIcon && cartSidebar) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                cartSidebar.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeCart && cartSidebar) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
        
        // Close cart when clicking outside
        if (cartSidebar) {
            cartSidebar.addEventListener('click', (e) => {
                if (e.target === cartSidebar) {
                    cartSidebar.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    // Add item to cart
    addItem(item) {
        // Check if item already exists in cart
        const existingItemIndex = this.cart.findIndex(cartItem => 
            cartItem.id === item.id && cartItem.size === item.size
        );
        
        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            this.cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            this.cart.push(item);
        }
        
        // Save to localStorage
        this.saveCart();
        
        // Update UI
        this.loadCartItems();
        updateCartCount();
        
        // Show notification
        showNotification(`${item.quantity} ${item.name} added to cart!`);
        
        // Open cart sidebar on mobile
        if (window.innerWidth < 768) {
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) {
                cartSidebar.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        }
    }
    
    // Update item quantity
    updateQuantity(index, change) {
        this.cart[index].quantity += change;
        
        // Remove item if quantity is 0 or less
        if (this.cart[index].quantity <= 0) {
            const itemName = this.cart[index].name;
            this.cart.splice(index, 1);
            showNotification(`${itemName} removed from cart`);
        } else {
            showNotification('Cart updated');
        }
        
        this.saveCart();
        this.loadCartItems();
        updateCartCount();
    }
    
    // Remove item from cart
    removeItem(index) {
        const itemName = this.cart[index].name;
        this.cart.splice(index, 1);
        
        this.saveCart();
        this.loadCartItems();
        updateCartCount();
        
        showNotification(`${itemName} removed from cart`);
    }
    
    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('yajiCart', JSON.stringify(this.cart));
    }
    
    // Checkout process
    checkout() {
        if (this.cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }
        
        this.sendCartToWhatsApp();
    }
    
    // Send cart to WhatsApp
    sendCartToWhatsApp() {
        let message = "Hello Yaji Master, I'd like to place an order:%0A%0A";
        
        this.cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            message += `${index + 1}. ${item.name} - ${item.size} x ${item.quantity} = ₦${itemTotal.toLocaleString('en-NG')}%0A`;
        });
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `%0ATotal: ₦${total.toLocaleString('en-NG')}%0A%0A`;
        message += "Please let me know the next steps for payment and delivery.";
        
        // Open WhatsApp with the message
        window.open(`https://wa.me/2348164083309?text=${message}`, '_blank');
    }
    
    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.loadCartItems();
        updateCartCount();
        showNotification('Cart cleared');
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.yajiCart = new ShoppingCart();
});