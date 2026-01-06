// Mobile Navigation Toggle - SIMPLIFIED & FIXED
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Debug: Check if elements exist
    console.log('Menu Toggle:', menuToggle);
    console.log('Nav Menu:', navMenu);
    
    // If elements don't exist, exit
    if (!menuToggle || !navMenu) {
        console.error('Mobile menu elements not found!');
        return;
    }
    
    // 1. TOGGLE MENU ON BUTTON CLICK - SIMPLIFIED
    menuToggle.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event bubbling
        console.log('Menu button clicked');
        
        navMenu.classList.toggle('active');
        
        // Update button icon
        if (navMenu.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            console.log('Menu opened');
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            console.log('Menu closed');
        }
    });
    
    // 2. CLOSE MENU WHEN CLICKING LINKS
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            console.log('Menu closed (link click)');
        });
    });
    
    // 3. CLOSE MENU WHEN CLICKING OUTSIDE - FIXED VERSION
    document.addEventListener('click', function(event) {
        // If menu is open AND click is NOT on menu toggle AND NOT inside nav menu
        if (navMenu.classList.contains('active') && 
            !menuToggle.contains(event.target) && 
            !navMenu.contains(event.target)) {
            
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            console.log('Menu closed (outside click)');
        }
    });
    
    // 4. CLOSE MENU ON ESCAPE KEY
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            console.log('Menu closed (Escape key)');
        }
    });
    
    // ===== REST OF YOUR CODE (unchanged) =====
    
    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.padding = '15px 0';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        }
    });
    
    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Initialize current year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    console.log('Mobile menu JavaScript loaded successfully');
});