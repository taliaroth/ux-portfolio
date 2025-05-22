// password-protection.js - Final Version

// Configuration
const PASSWORD = "unlockme"; // Change this to your desired password
const AUTH_DURATION = 7; // How many days the authentication lasts in local storage

// Enable/disable protection features
const ENABLE_PROTECTION = {
    navPassword: true,     // Show password field in navigation (global)
    contentProtection: false // Apply blur protection to content (page-specific)
};

// Check if this page should have content protection
function shouldProtectContent() {
    const protectPage = document.body.getAttribute('data-protect-content');
    if (protectPage !== null) {
        return protectPage === 'true';
    }
    
    const protectedPages = [
        '/request-forum.html',
        '/project-xyz.html'
    ];
    
    const currentPath = window.location.pathname;
    return protectedPages.includes(currentPath);
}

document.addEventListener('DOMContentLoaded', function() {
    // First, restructure the header for the new layout
    restructureHeader();
    
    // Check if already authenticated
    const isAuthenticated = checkAuthentication();
    
    // Add password protection to navigation if not authenticated
    if (ENABLE_PROTECTION.navPassword && !isAuthenticated) {
        if (window.innerWidth <= 768) {
            addMobileLockButton();
            createPasswordModal();
        } else {
            addPasswordToNavigation();
        }
    }
    
    // Apply content protection on specified pages
    if (ENABLE_PROTECTION.contentProtection || shouldProtectContent()) {
        setupProtectedSections();
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            handleResponsivePassword();
        }, 250);
    });
});

function restructureHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Get existing elements
    const logo = header.querySelector('.logo');
    const nav = header.querySelector('.main-nav');
    const menuToggle = header.querySelector('.menu-toggle');
    const themeToggle = header.querySelector('.theme-toggle');
    
    // Create new structure
    const headerLeft = document.createElement('div');
    headerLeft.className = 'header-left';
    
    const headerCenter = document.createElement('div');
    headerCenter.className = 'header-center';
    
    const headerRight = document.createElement('div');
    headerRight.className = 'header-right';
    
    // Clear header
    header.innerHTML = '';
    
    // Rebuild header with new structure
    if (logo) headerLeft.appendChild(logo);
    if (nav) headerCenter.appendChild(nav);
    if (menuToggle) headerRight.appendChild(menuToggle);
    // Password input will be added here
    if (themeToggle) headerRight.appendChild(themeToggle);
    
    header.appendChild(headerLeft);
    header.appendChild(headerCenter);
    header.appendChild(headerRight);
}

function addPasswordToNavigation() {
    const headerRight = document.querySelector('.header-right');
    if (!headerRight) return;
    
    const navPasswordForm = document.createElement('form');
    navPasswordForm.classList.add('nav-password-form');
    navPasswordForm.innerHTML = `
        <div class="password-input-wrapper">
            <input type="password" 
                   id="navPasswordInput" 
                   placeholder="Enter password" 
                   class="password-input small">
            <button type="submit" class="password-submit-btn small">
                <div class="icon-arrow-enter"></div>
            </button>
        </div>
    `;
    
    // Insert before theme toggle
    const themeToggle = headerRight.querySelector('.theme-toggle');
    if (themeToggle) {
        headerRight.insertBefore(navPasswordForm, themeToggle);
    } else {
        headerRight.appendChild(navPasswordForm);
    }
    
    navPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handlePasswordSubmit('navPasswordInput', navPasswordForm);
    });
}

function addMobileLockButton() {
    const headerRight = document.querySelector('.header-right');
    if (!headerRight) return;
    
    const lockButton = document.createElement('button');
    lockButton.classList.add('mobile-lock-button');
    lockButton.innerHTML = '<div class="lock-icon"></div>';
    lockButton.setAttribute('aria-label', 'Enter password');
    
    // Insert before theme toggle
    const themeToggle = headerRight.querySelector('.theme-toggle');
    if (themeToggle) {
        headerRight.insertBefore(lockButton, themeToggle);
    } else {
        headerRight.appendChild(lockButton);
    }
    
    lockButton.addEventListener('click', function() {
        const modal = document.querySelector('.password-modal');
        if (modal) {
            modal.classList.add('open');
            const input = modal.querySelector('.password-input');
            if (input) {
                setTimeout(() => input.focus(), 300);
            }
        }
    });
}

function createPasswordModal() {
    const modal = document.createElement('div');
    modal.classList.add('password-modal');
    modal.innerHTML = `
        <div class="password-modal-content">
            <button class="close-modal" aria-label="Close modal">&times;</button>
            <h3>PROTECTED CONTENT</h3>
            <p>Enter password to unlock</p>
            <form class="modal-password-form">
                <div class="password-input-wrapper">
                    <input type="password" 
                           id="modalPasswordInput" 
                           placeholder="Enter password" 
                           class="password-input large">
                    <button type="submit" class="password-submit-btn large">
                        <div class="icon-arrow-enter"></div>
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });
    
    // Form submission
    const form = modal.querySelector('.modal-password-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handlePasswordSubmit('modalPasswordInput', form, () => {
            modal.classList.remove('open');
        });
    });
}

function handlePasswordSubmit(inputId, formElement, onSuccess) {
    const password = document.getElementById(inputId).value;
    
    if (password === PASSWORD) {
        unlockAllContent();
        saveAuthentication();
        
        // Remove password UI elements
        removePasswordUI();
        
        if (onSuccess) onSuccess();
        
        showSuccessMessage("Content unlocked successfully!");
    } else {
        // Shake animation
        formElement.classList.add('shake');
        setTimeout(() => {
            formElement.classList.remove('shake');
        }, 500);
        
        showErrorMessage("Incorrect password");
        document.getElementById(inputId).value = '';
    }
}

function removePasswordUI() {
    // Remove desktop password form
    const navForm = document.querySelector('.nav-password-form');
    if (navForm) {
        navForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        navForm.style.opacity = '0';
        navForm.style.transform = 'scale(0.9)';
        setTimeout(() => navForm.remove(), 300);
    }
    
    // Remove mobile lock button
    const lockButton = document.querySelector('.mobile-lock-button');
    if (lockButton) {
        lockButton.style.transition = 'opacity 0.3s ease';
        lockButton.style.opacity = '0';
        setTimeout(() => lockButton.remove(), 300);
    }
    
    // Remove modal
    const modal = document.querySelector('.password-modal');
    if (modal) {
        modal.remove();
    }
}

function handleResponsivePassword() {
    const isAuthenticated = checkAuthentication();
    if (isAuthenticated || !ENABLE_PROTECTION.navPassword) return;
    
    const hasDesktopForm = document.querySelector('.nav-password-form');
    const hasMobileButton = document.querySelector('.mobile-lock-button');
    const hasModal = document.querySelector('.password-modal');
    
    if (window.innerWidth <= 768) {
        // Switch to mobile
        if (hasDesktopForm) {
            hasDesktopForm.remove();
        }
        if (!hasMobileButton) {
            addMobileLockButton();
        }
        if (!hasModal) {
            createPasswordModal();
        }
    } else {
        // Switch to desktop
        if (hasMobileButton) {
            hasMobileButton.remove();
        }
        if (hasModal) {
            hasModal.remove();
        }
        if (!hasDesktopForm) {
            addPasswordToNavigation();
        }
    }
}

function setupProtectedSections() {
    const projectSections = document.querySelectorAll('.project-section');
    
    projectSections.forEach((section, index) => {
        if (index === 0) {
            // Leave the overview section visible
            return; 
        }
        
        const wrapper = document.createElement('div');
        wrapper.classList.add('protected-section-wrapper');
        
        const overlay = document.createElement('div');
        overlay.classList.add('password-overlay');
        overlay.innerHTML = `
            <div class="password-form-container">
                <h3>PROTECTED CONTENT</h3>
                <p>This section contains private information</p>
                <form class="section-password-form">
                    <div class="password-input-wrapper">
                        <input type="password" 
                               placeholder="Enter password" 
                               class="password-input large">
                        <button type="submit" class="password-submit-btn large">
                            <div class="icon-arrow-enter"></div>
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        if (index === 1) {
            // Show first protected section with blur
            const originalSection = section.cloneNode(true);
            originalSection.classList.add('blurred-content');
            
            section.innerHTML = '';
            wrapper.appendChild(originalSection);
            wrapper.appendChild(overlay);
            section.appendChild(wrapper);
            
            section.classList.add('first-protected-section');
        } else {
            // Hide subsequent sections
            section.style.display = 'none';
            section.classList.add('hidden-protected-section');
        }
        
        // Add event listener to password forms
        const form = overlay.querySelector('.section-password-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const passwordInput = this.querySelector('.password-input');
                const password = passwordInput.value;
                
                if (password === PASSWORD) {
                    if (index === 1) {
                        unlockSection(wrapper);
                    }
                    unlockAllContent();
                    saveAuthentication();
                    removePasswordUI();
                    showSuccessMessage("All content unlocked!");
                } else {
                    const container = this.closest('.password-form-container');
                    container.classList.add('shake');
                    setTimeout(() => {
                        container.classList.remove('shake');
                    }, 500);
                    
                    showErrorMessage("Incorrect password");
                    passwordInput.value = '';
                }
            });
        }
    });
    
    if (!checkAuthentication()) {
        const nextProjectNav = document.querySelector('.next-project');
        if (nextProjectNav) {
            nextProjectNav.style.marginTop = '40px';
        }
    }
}

function unlockSection(wrapper) {
    const blurredContent = wrapper.querySelector('.blurred-content');
    const overlay = wrapper.querySelector('.password-overlay');
    
    blurredContent.classList.remove('blurred-content');
    blurredContent.classList.add('unblurred-content');
    
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

function unlockAllContent() {
    const wrappers = document.querySelectorAll('.protected-section-wrapper');
    wrappers.forEach(wrapper => {
        unlockSection(wrapper);
    });
    
    const hiddenSections = document.querySelectorAll('.hidden-protected-section');
    hiddenSections.forEach(section => {
        section.style.display = '';
        section.classList.remove('hidden-protected-section');
        section.classList.add('revealed-section');
    });
    
    const nextProjectNav = document.querySelector('.next-project');
    if (nextProjectNav) {
        nextProjectNav.style.marginTop = '';
    }
}

function saveAuthentication() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + AUTH_DURATION);
    
    try {
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('authExpiry', expiryDate.toISOString());
    } catch (e) {
        console.error('LocalStorage not available:', e);
    }
}

function checkAuthentication() {
    try {
        const authenticated = localStorage.getItem('authenticated') === 'true';
        const expiry = localStorage.getItem('authExpiry');
        
        if (authenticated && expiry) {
            const expiryDate = new Date(expiry);
            const now = new Date();
            
            if (now < expiryDate) {
                unlockAllContent();
                return true;
            } else {
                localStorage.removeItem('authenticated');
                localStorage.removeItem('authExpiry');
            }
        }
    } catch (e) {
        console.error('LocalStorage not available:', e);
    }
    
    return false;
}

function showSuccessMessage(message) {
    showNotification(message, 'success-notification');
}

function showErrorMessage(message) {
    showNotification(message, 'error-notification');
}

function showNotification(message, className) {
    const notification = document.createElement('div');
    notification.classList.add('notification', className);
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}