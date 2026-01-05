// ===== WHATSAPP INTEGRATION =====

document.addEventListener('DOMContentLoaded', function() {
    // WhatsApp floating button
    const whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me/2348164083309?text=Hello%20Yaji%20Master%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20products';
    whatsappButton.className = 'whatsapp-float';
    whatsappButton.target = '_blank';
    whatsappButton.setAttribute('aria-label', 'Chat with us on WhatsApp');
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .whatsapp-float {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-color: #25D366;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 100;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        
        .whatsapp-float:hover {
            background-color: #128C7E;
            transform: scale(1.1);
            color: white;
        }
        
        @media (max-width: 767px) {
            .whatsapp-float {
                width: 50px;
                height: 50px;
                font-size: 24px;
                bottom: 15px;
                right: 15px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(whatsappButton);
    
    // Track WhatsApp clicks for analytics
    const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // You can add analytics tracking here
            console.log('WhatsApp link clicked:', this.href);
            
            // For Google Analytics (if implemented later)
            // gtag('event', 'whatsapp_click', {
            //     'event_category': 'engagement',
            //     'event_label': this.href
            // });
        });
    });
    
    // Pre-fill WhatsApp message based on page context
    const productWhatsappButtons = document.querySelectorAll('.btn-whatsapp');
    productWhatsappButtons.forEach(button => {
        if (button.href.includes('place%20an%20order')) {
            // On product pages, include product info in message
            const productName = document.querySelector('.product-title')?.textContent || 'product';
            button.href = `https://wa.me/2348164083309?text=Hello%20Yaji%20Master%2C%20I'm%20interested%20in%20your%20${encodeURIComponent(productName)}%20spice%20blend.%20Can%20you%20tell%20me%20more%3F`;
        }
    });
});