// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        // Store preference in localStorage if needed later
        try {
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        } catch (e) {
            console.log('localStorage not available');
        }
    });
    
    // Check for saved theme preference
    try {
        // Explicitly ensure dark mode is default
        const savedTheme = localStorage.getItem('theme');
        
        // If there's no saved preference, ensure it's set to dark
        if (savedTheme === null) {
            localStorage.setItem('theme', 'dark');
            // Body already has no light-mode class by default, so we're good
        }
        // Only add light-mode class if that's the saved preference
        else if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }
        // If light-mode class somehow exists but shouldn't, remove it
        else if (savedTheme === 'dark' && document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
        }
    } catch (e) {
        console.log('localStorage not available');
        // Ensure dark mode if localStorage isn't available
        document.body.classList.remove('light-mode');
    }
});

// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all carousels on the page
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(function(carouselContainer) {
        const carousel = carouselContainer.querySelector('.carousel');
        const track = carouselContainer.querySelector('.carousel-track');
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const indicators = carouselContainer.querySelector('.carousel-indicators');
        const prevBtn = carouselContainer.querySelector('.carousel-prev');
        const nextBtn = carouselContainer.querySelector('.carousel-next');
        let currentIndex = 0;
        let isTransitioning = false;
        
        // Create indicators
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (index === 0) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                if (!isTransitioning) {
                    goToSlide(index);
                }
            });
            indicators.appendChild(indicator);
        });
        
        // Function to go to a specific slide
        function goToSlide(index) {
            if (isTransitioning) return;
            
            isTransitioning = true;
            
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }
            
            track.style.transform = `translateX(-${index * 100}%)`;
            
            // Update indicators
            const allIndicators = carouselContainer.querySelectorAll('.carousel-indicator');
            allIndicators.forEach((ind, i) => {
                if (i === index) {
                    ind.classList.add('active');
                } else {
                    ind.classList.remove('active');
                }
            });
            
            currentIndex = index;
            
            // Set a timeout to match the transition duration in CSS (0.5s)
            setTimeout(() => {
                isTransitioning = false;
            }, 600); // slightly longer than the transition to ensure it completes
        }
        
        // Event listeners for prev and next buttons
        prevBtn.addEventListener('click', () => {
            if (!isTransitioning) {
                goToSlide(currentIndex - 1);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (!isTransitioning) {
                goToSlide(currentIndex + 1);
            }
        });
        
        // Add touch support for mobile (swipe left/right)
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (isTransitioning) return;
            
            const threshold = 50; // Minimum swipe distance
            if (touchEndX < touchStartX - threshold) {
                // Swipe left - next slide
                goToSlide(currentIndex + 1);
            } else if (touchEndX > touchStartX + threshold) {
                // Swipe right - previous slide
                goToSlide(currentIndex - 1);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the tab to show
            const tabId = button.dataset.tab;
            
            // Remove active class from all panes
            const tabPanes = document.querySelectorAll('.tab-pane');
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to the corresponding pane
            document.getElementById(tabId).classList.add('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileMenuCloseBtn = document.getElementById('mobileMenuCloseBtn'); // Get the new close button
    
    function closeMobileMenu() {
        menuToggle.classList.remove('menu-open');
        mobileMenuOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function openMobileMenu() {
        menuToggle.classList.add('menu-open');
        mobileMenuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        if (mobileMenuOverlay.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Close menu when the new X button is clicked
    if (mobileMenuCloseBtn) {
        mobileMenuCloseBtn.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    // Fix for links with hash to work properly with the mobile menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Skip for mobile nav links as they have their own event handler
            if (this.classList.contains('mobile-nav-link')) {
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    // Wait for menu to close before scrolling
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }, 300); // Corresponds to menu transition time
                }
            } else {
                // Desktop nav links - original behavior
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Check if there's a hash in the URL when page loads
if (window.location.hash) {
    // Wait a bit for page to fully load
    setTimeout(function() {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, 100);
}

// Add this to your script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with the email-protection class
    const emailLinks = document.querySelectorAll('.email-protection');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the email from the data attribute
            const email = this.getAttribute('data-email');
            
            // Replace the text content with the email
            this.textContent = email;
            
            // Update the href attribute to include mailto:
            this.setAttribute('href', 'mailto:' + email);
            
            // Optional: Remove the click event after it's been revealed
            this.removeEventListener('click', arguments.callee);
        });
    });
});