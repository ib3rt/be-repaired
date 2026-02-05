/**
 * Be Repaired - Main JavaScript
 * Professional Handyman Services Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    initFAQAccordion();
    initFormValidation();
    initBackToTop();
    initScrollAnimations();
    initNavbarScroll();
    initZipcodeChecker();
    initServiceCardHover();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transition = 'all 0.3s ease';
            });
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * FAQ Accordion
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close other open items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const form = document.getElementById('bookingForm');
    
    if (!form) return;
    
    // Form fields configuration
    const validators = {
        firstName: {
            validate: (value) => value.trim().length >= 2,
            message: 'Please enter your first name'
        },
        lastName: {
            validate: (value) => value.trim().length >= 2,
            message: 'Please enter your last name'
        },
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        },
        phone: {
            validate: (value) => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value.replace(/\s/g, '')),
            message: 'Please enter a valid phone number'
        },
        address: {
            validate: (value) => value.trim().length >= 5,
            message: 'Please enter your address'
        },
        city: {
            validate: (value) => value.trim().length >= 2,
            message: 'Please enter your city'
        },
        zipCode: {
            validate: (value) => /^\d{5}$/.test(value),
            message: 'Please enter a valid 5-digit zip code'
        },
        serviceType: {
            validate: (value) => value !== '',
            message: 'Please select a service type'
        },
        description: {
            validate: (value) => value.trim().length >= 10,
            message: 'Please describe your project (at least 10 characters)'
        },
        terms: {
            validate: (value, element) => element.checked,
            message: 'Please agree to the terms'
        }
    };
    
    // Real-time validation on blur
    Object.keys(validators).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('blur', () => validateField(field, validators[fieldName]));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field, validators[fieldName]);
                }
            });
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = {};
        
        // Validate all fields
        Object.keys(validators).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const fieldValid = validateField(field, validators[fieldName]);
                if (!fieldValid) isValid = false;
                formData[fieldName] = field.value;
            }
        });
        
        if (isValid) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Hide form and show success message
                form.style.display = 'none';
                document.getElementById('formSuccess').style.display = 'block';
                
                // Reset button state
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                
                // Log form data (in production, send to server)
                console.log('Form submitted successfully:', formData);
            }, 1500);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.form-group input.error, .form-group select.error, .form-group textarea.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
}

/**
 * Validate individual field
 */
function validateField(field, validator) {
    const value = field.value;
    const fieldName = field.name;
    const errorElement = field.closest('.form-group').querySelector('.error-message') || field.parentElement.querySelector('.error-message');
    const isCheckbox = field.type === 'checkbox';
    
    const isValid = isCheckbox ? validator.validate(value, field) : validator.validate(value);
    
    if (!isValid) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = validator.message;
        }
        return false;
    } else {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        return true;
    }
}

/**
 * Reset form (called from success state)
 */
function resetForm() {
    const form = document.getElementById('bookingForm');
    const successMessage = document.getElementById('formSuccess');
    
    if (form && successMessage) {
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Clear any error states
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .service-card, .pricing-card, .team-card, .testimonial-card, .showcase-item, .faq-item'
    );
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }
}

/**
 * Navbar Scroll Effect
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            navbar.style.padding = '12px 0';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '16px 0';
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    });
}

/**
 * Zipcode Checker
 */
function initZipcodeChecker() {
    const zipcodeForm = document.querySelector('.zipcode-form');
    
    if (!zipcodeForm) return;
    
    zipcodeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = this.querySelector('.zipcode-input');
        const zipcode = input.value.trim();
        
        if (zipcode.length === 5 && /^\d+$/.test(zipcode)) {
            // Simulate checking zipcode
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            button.textContent = 'Checking...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                
                // Show result (in production, this would check actual service areas)
                alert(`Great news! We service your area (${zipcode}). Fill out the booking form to schedule your service!`);
            }, 1000);
        } else {
            alert('Please enter a valid 5-digit zip code.');
            input.focus();
        }
    });
}

/**
 * Service Card Hover Effects
 */
function initServiceCardHover() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Phone number formatting
 */
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        
        e.target.value = value;
    });
});

/**
 * Date input - set minimum date to today
 */
const dateInput = document.getElementById('preferredDate');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

/**
 * Lazy load images (if supported)
 */
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.src = img.dataset.src;
    });
}

/**
 * Console welcome message
 */
console.log('%c Be Repaired ', 'background: #f97316; color: white; font-size: 24px; padding: 10px;');
console.log('%c Quality Repairs, Done Right ', 'color: #f97316; font-size: 14px;');
console.log('%c Trusted Professional Handyman Services ', 'color: #64748b; font-size: 12px;');
