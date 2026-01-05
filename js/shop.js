// Shop page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Product data
    const products = [
        {
            id: 1,
            name: "Soulful Heat",
            description: "A balanced blend with medium heat and rich flavour. Perfect for everyday meals and introducing yaji to new palates.",
            price100g: 2500,
            price200g: 4500,
            image: "soulful-heat.jpg",
            color: "#b33e2c",
            link: "product-soulful-heat.html",
            category: "spicy",
            featured: true,
            rating: 4.8,
            reviews: 127
        },
        {
            id: 2,
            name: "Heritage Fire",
            description: "Traditional suya spice with authentic smoky notes and warm, layered heat. The classic Nigerian street flavor.",
            price100g: 2800,
            price200g: 4800,
            image: "heritage-fire.jpg",
            color: "#d97706",
            link: "product-heritage-fire.html",
            category: "traditional",
            featured: true,
            rating: 4.9,
            reviews: 89
        },
        {
            id: 3,
            name: "Smoked Suya Heat",
            description: "Intense heat with traditional smoking process. For those who love authentic street suya flavor with extra kick.",
            price100g: 3000,
            price200g: 5000,
            image: "smoked-suya.jpg",
            color: "#854d0e",
            link: "product-smoked-suya-heat.html",
            category: "spicy",
            featured: true,
            rating: 4.7,
            reviews: 64
        },
        {
            id: 4,
            name: "Garlic Gold",
            description: "Garlic-forward blend with subtle heat and herbs. Perfect for those who prefer milder spice with rich garlic flavor.",
            price100g: 2700,
            price200g: 4700,
            image: "garlic-gold.jpg",
            color: "#d4a574",
            link: "product-garlic-gold.html",
            category: "mild",
            featured: false,
            rating: 4.6,
            reviews: 52
        }
    ];

    // Render products
    function renderProducts(productsArray, containerId, showAll = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        let html = '';
        
        productsArray.forEach(product => {
            // For featured section, only show featured products
            if (!showAll && containerId === 'featuredProducts' && !product.featured) {
                return;
            }
            
            const isFeatured = product.featured ? '<span class="product-badge">Featured</span>' : '';
            
            html += `
                <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                    ${isFeatured}
                    <div class="product-image">
                        <img src="images/products/${product.image}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        
                        <div class="product-pricing">
                            <div class="price-range">
                                <span class="price">₦${product.price100g.toLocaleString('en-NG')} - ₦${product.price200g.toLocaleString('en-NG')}</span>
                                <div class="rating">
                                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                                    <span class="rating-text">${product.rating} (${product.reviews})</span>
                                </div>
                            </div>
                            <div class="size-info">
                                <i class="fas fa-weight-hanging"></i>
                                <span>Available in 100g & 200g bottles</span>
                            </div>
                        </div>
                        
                        <div class="size-selector">
                            <button class="size-btn active" 
                                data-price="${product.price100g}"
                                data-size="100g">
                                100g Bottle
                                <span class="size-price">₦${product.price100g.toLocaleString('en-NG')}</span>
                            </button>
                            <button class="size-btn" 
                                data-price="${product.price200g}"
                                data-size="200g">
                                200g Bottle
                                <span class="size-price">₦${product.price200g.toLocaleString('en-NG')}</span>
                            </button>
                        </div>
                        
                        <div class="product-actions">
                            <a href="${product.link}" class="btn-view-details">
                                <i class="fas fa-info-circle"></i> Details
                            </a>
                            <button class="btn-add-cart add-to-cart" 
                                data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${product.price100g}"
                                data-size="100g"
                                data-image="${product.image}">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Initialize size selectors
        initializeSizeSelectors();
        
        // Initialize add to cart buttons
        initializeAddToCartButtons();
        
        // Update product count
        if (containerId === 'allProducts') {
            updateProductCount(productsArray.length);
        }
    }
    
    // Initialize size selectors
    function initializeSizeSelectors() {
        const sizeButtons = document.querySelectorAll('.size-btn');
        
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                
                // Remove active class from all size buttons in this card
                productCard.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update the add to cart button in this card
                const addToCartBtn = productCard.querySelector('.btn-add-cart');
                if (addToCartBtn) {
                    const price = this.getAttribute('data-price');
                    const size = this.getAttribute('data-size');
                    
                    addToCartBtn.setAttribute('data-price', price);
                    addToCartBtn.setAttribute('data-size', size);
                    
                    // Update button text with selected size
                    const productName = addToCartBtn.getAttribute('data-name');
                    addToCartBtn.innerHTML = `<i class="fas fa-cart-plus"></i> Add ${size} to Cart`;
                }
            });
        });
    }
    
    // Initialize add to cart buttons
    function initializeAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                const size = this.getAttribute('data-size');
                const image = this.getAttribute('data-image');
                
                // Add to cart using the global cart function
                if (window.yajiCart && typeof window.yajiCart.addToCart === 'function') {
                    window.yajiCart.addToCart({
                        id: id,
                        name: name,
                        price: price,
                        size: size,
                        image: image,
                        quantity: 1
                    });
                    
                    // Show success feedback
                    showAddToCartFeedback(this);
                }
            });
        });
    }
    
    // Show add to cart feedback
    function showAddToCartFeedback(button) {
        const originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.style.background = '';
        }, 1500);
    }
    
    // Update product count
    function updateProductCount(count) {
        const countElement = document.getElementById('productCount');
        if (countElement) {
            countElement.textContent = count;
        }
    }
    
    // Filter products
    function filterProducts() {
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortBy');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                const category = this.value;
                let filteredProducts = products;
                
                if (category !== 'all') {
                    filteredProducts = products.filter(product => product.category === category);
                }
                
                renderProducts(filteredProducts, 'allProducts', true);
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', function() {
                const sortValue = this.value;
                let sortedProducts = [...products];
                
                switch(sortValue) {
                    case 'price-low':
                        sortedProducts.sort((a, b) => a.price100g - b.price100g);
                        break;
                    case 'price-high':
                        sortedProducts.sort((a, b) => b.price100g - a.price100g);
                        break;
                    case 'name':
                        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    default:
                        // Featured order
                        sortedProducts.sort((a, b) => b.featured - a.featured || b.rating - a.rating);
                }
                
                renderProducts(sortedProducts, 'allProducts', true);
            });
        }
    }
    
    // Initialize bundle buttons
    function initializeBundleButtons() {
        const bundleButtons = document.querySelectorAll('.add-bundle');
        
        bundleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bundleType = this.getAttribute('data-bundle');
                
                let bundleItems = [];
                let bundlePrice = 0;
                
                if (bundleType === 'starter') {
                    bundleItems = [
                        { id: 1, name: "Soulful Heat", price: 2500, size: "100g", quantity: 1 },
                        { id: 2, name: "Heritage Fire", price: 2800, size: "100g", quantity: 1 }
                    ];
                    bundlePrice = 4800;
                } else if (bundleType === 'family') {
                    bundleItems = [
                        { id: 1, name: "Soulful Heat", price: 2500, size: "100g", quantity: 1 },
                        { id: 2, name: "Heritage Fire", price: 2800, size: "100g", quantity: 1 },
                        { id: 3, name: "Smoked Suya Heat", price: 3000, size: "100g", quantity: 1 },
                        { id: 4, name: "Garlic Gold", price: 2700, size: "100g", quantity: 1 }
                    ];
                    bundlePrice = 9500;
                }
                
                // Add each item to cart
                if (window.yajiCart && typeof window.yajiCart.addBundle === 'function') {
                    window.yajiCart.addBundle(bundleItems, bundlePrice, `${bundleType} bundle`);
                    
                    // Show success feedback
                    const originalHtml = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Bundle Added!';
                    this.style.background = '#10b981';
                    
                    setTimeout(() => {
                        this.innerHTML = originalHtml;
                        this.style.background = '';
                    }, 1500);
                }
            });
        });
    }
    
    // Initialize shop
    function initShop() {
        // Render featured products
        renderProducts(products, 'featuredProducts');
        
        // Render all products
        renderProducts(products, 'allProducts', true);
        
        // Initialize filters
        filterProducts();
        
        // Initialize bundle buttons
        initializeBundleButtons();
    }
    
    // Initialize shop when DOM is loaded
    initShop();
});