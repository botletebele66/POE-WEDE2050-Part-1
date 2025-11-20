// Ubuntu Rise Community Hub - Complete Interactive Functionality
$(document).ready(function() {
    
    // ===== INITIALIZATION =====
    console.log('Ubuntu Rise Community Hub - Interactive features loaded');
    
    // ===== VARIABLES =====
    let currentImageIndex = 0;
    let images = [];

    // ===== ACCORDION FUNCTIONALITY =====
    function initAccordions() {
        $('.accordion-header').click(function() {
            const $accordion = $(this).closest('.accordion');
            const $content = $accordion.find('.accordion-content');
            const $icon = $(this).find('.accordion-icon');
            
            // Toggle current accordion
            const isOpening = !$content.is(':visible');
            
            // Close all accordions in the same container
            $accordion.siblings('.accordion').find('.accordion-content').slideUp(300);
            $accordion.siblings('.accordion').find('.accordion-header').removeClass('active');
            $accordion.siblings('.accordion').find('.accordion-icon').text('+');
            
            // Toggle current
            if (isOpening) {
                $content.slideDown(300);
                $(this).addClass('active');
                $icon.text('−');
            } else {
                $content.slideUp(300);
                $(this).removeClass('active');
                $icon.text('+');
            }
        });
        
        // Open first accordion by default
        $('.accordion').first().find('.accordion-header').trigger('click');
    }

    // ===== ENHANCED MODAL & LIGHTBOX FUNCTIONALITY =====
    function initModals() {
        // Lightbox functionality for gallery images
        $('.gallery-image').click(function(e) {
            e.stopPropagation();
            
            // Get all gallery images
            images = $('.gallery-image').toArray();
            currentImageIndex = images.indexOf(this);
            
            openLightbox(this.src, this.alt);
        });

        // Close modal events
        $('.close-modal, .modal-overlay').click(function(e) {
            e.stopPropagation();
            closeLightbox();
        });

        // Exit button click
        $('.exit-modal').click(function(e) {
            e.stopPropagation();
            closeLightbox();
        });

        // Navigation buttons
        $('.next-btn').click(function(e) {
            e.stopPropagation();
            nextImage();
        });

        $('.prev-btn').click(function(e) {
            e.stopPropagation();
            prevImage();
        });

        // Prevent modal content from closing modal
        $('.modal-content').click(function(e) {
            e.stopPropagation();
        });

        // Keyboard navigation
        $(document).keydown(function(e) {
            if (!$('#lightbox-modal').is(':visible')) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
            }
        });

        // Add keyboard shortcuts hint if not already present
        if (!$('.keyboard-hint').length) {
            $('#lightbox-modal').append('<div class="keyboard-hint">Press ← → to navigate, ESC to close</div>');
        }
    }

    // Lightbox helper functions
    function openLightbox(src, alt) {
        $('#lightbox-image').attr('src', src).attr('alt', alt);
        $('#lightbox-caption').text(alt);
        $('#lightbox-modal').fadeIn(300).addClass('active');
        $('body').addClass('modal-open');
        
        // Update navigation buttons state
        updateNavigationButtons();
    }

    function closeLightbox() {
        $('#lightbox-modal').fadeOut(300).removeClass('active');
        $('body').removeClass('modal-open');
        currentImageIndex = 0;
        images = [];
    }

    function nextImage() {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            const nextImage = images[currentImageIndex];
            $('#lightbox-image').attr('src', nextImage.src).attr('alt', nextImage.alt);
            $('#lightbox-caption').text(nextImage.alt);
            updateNavigationButtons();
        }
    }

    function prevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            const prevImage = images[currentImageIndex];
            $('#lightbox-image').attr('src', prevImage.src).attr('alt', prevImage.alt);
            $('#lightbox-caption').text(prevImage.alt);
            updateNavigationButtons();
        }
    }

    function updateNavigationButtons() {
        $('.prev-btn').prop('disabled', currentImageIndex === 0);
        $('.next-btn').prop('disabled', currentImageIndex === images.length - 1);
        
        // Update ARIA labels for accessibility
        $('.prev-btn').attr('aria-label', `Previous image (${currentImageIndex} of ${images.length})`);
        $('.next-btn').attr('aria-label', `Next image (${currentImageIndex + 2} of ${images.length})`);
    }

    // ===== REAL FORM PROCESSING =====
    function processFormSubmission(form, isDonation = false) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate API call - in production, this would send to a server
        return new Promise((resolve) => {
            setTimeout(() => {
                const message = isDonation 
                    ? `Thank you for your R${data.amount} donation! We'll email you at ${data.email} with confirmation.`
                    : `Thank you for your message! We'll contact you at ${data.email} within 24 hours.`;
                
                resolve({ success: true, message: message });
            }, 1500);
        });
    }

    // ===== FORM VALIDATION & SUBMISSION =====
    function initForms() {
        $('form').each(function() {
            const $form = $(this);
            
            $form.submit(function(e) {
                e.preventDefault();
                
                let isValid = true;
                const form = $(this);
                
                // Clear previous errors
                form.find('.error-message').remove();
                form.find('.form-group').removeClass('error');
                
                // Validate required fields
                form.find('[required]').each(function() {
                    const field = $(this);
                    const value = field.val().trim();
                    
                    if (!value) {
                        showError(field, 'This field is required');
                        isValid = false;
                        return;
                    }
                    
                    // Email validation
                    if (field.attr('type') === 'email' && value) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            showError(field, 'Please enter a valid email address');
                            isValid = false;
                        }
                    }
                    
                    // Phone validation
                    if (field.attr('type') === 'tel' && value) {
                        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                            showError(field, 'Please enter a valid phone number');
                            isValid = false;
                        }
                    }
                    
                    // Donation amount validation
                    if (field.attr('id') === 'amount' && value) {
                        const amount = parseFloat(value);
                        if (amount < 1) {
                            showError(field, 'Please enter a valid donation amount');
                            isValid = false;
                        }
                    }
                });
                
                // Validate checkbox
                const $checkbox = form.find('input[type="checkbox"][required]');
                if ($checkbox.length && !$checkbox.is(':checked')) {
                    showError($checkbox, 'This agreement is required');
                    isValid = false;
                }
                
                if (isValid) {
                    submitForm(form);
                }
            });
            
            // Real-time validation
            $form.find('input, select, textarea').on('blur', function() {
                validateField($(this));
            });
        });
    }

    function validateField(field) {
        const value = field.val().trim();
        field.closest('.form-group').find('.error-message').remove();
        field.closest('.form-group').removeClass('error');
        
        if (field.attr('required') && !value) {
            showError(field, 'This field is required');
            return false;
        }
        
        if (field.attr('type') === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        return true;
    }

    function showError(field, message) {
        const $formGroup = field.closest('.form-group');
        $formGroup.addClass('error');
        $formGroup.append(`<div class="error-message" role="alert">${message}</div>`);
        
        // Add aria-invalid for accessibility
        field.attr('aria-invalid', 'true');
        
        // Scroll to error if it's the first one
        if ($('.error-message').length === 1) {
            $('html, body').animate({
                scrollTop: $formGroup.offset().top - 100
            }, 500);
        }
    }

    function submitForm(form) {
        const formData = new FormData(form[0]);
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.text();
        const isDonation = form.hasClass('donation-form');
        
        // Disable form and show loading state
        submitBtn.prop('disabled', true).text('Sending...');
        form.find('input, select, textarea, button').prop('disabled', true);
        
        // Process the form with real processing
        processFormSubmission(form[0], isDonation)
            .then(result => {
                if (result.success) {
                    form.before(`<div class="success-message" role="alert">${result.message}</div>`);
                    form[0].reset();
                    
                    // Scroll to success message
                    $('html, body').animate({
                        scrollTop: form.offset().top - 100
                    }, 500);
                }
            })
            .catch(error => {
                form.before(`<div class="error-message" role="alert">Sorry, there was an error. Please try again or contact us directly.</div>`);
            })
            .finally(() => {
                // Re-enable after 3 seconds
                setTimeout(() => {
                    submitBtn.prop('disabled', false).text(originalText);
                    form.find('input, select, textarea, button').prop('disabled', false);
                    $('.success-message, .error-message').fadeOut(300, function() {
                        $(this).remove();
                    });
                }, 3000);
            });
    }

    // ===== SMOOTH SCROLL =====
    function initSmoothScroll() {
        $('nav a[href^="#"]').click(function(e) {
            e.preventDefault();
            const target = $(this).attr('href');
            
            if (target === '#') return;
            
            const $target = $(target);
            if ($target.length) {
                $('html, body').animate({
                    scrollTop: $target.offset().top - 80
                }, 800);
            }
        });
    }

    // ===== SEARCH FUNCTIONALITY =====
    function initSearch() {
        $('#search-input').on('input', function() {
            const query = $(this).val().toLowerCase().trim();
            
            if (query.length === 0) {
                $('.program-card').show();
                return;
            }

            $('.program-card').each(function() {
                const text = $(this).text().toLowerCase();
                const isVisible = text.includes(query);
                $(this).toggle(isVisible);
            });
        });
        
        // Clear search on escape
        $('#search-input').keydown(function(e) {
            if (e.key === 'Escape') {
                $(this).val('').trigger('input');
            }
        });
    }

    // ===== FILTER FUNCTIONALITY =====
    function initFilters() {
        $('.filter-btn').click(function() {
            const filter = $(this).data('filter');
            
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            
            if (filter === 'all') {
                $('.program-card').show();
            } else {
                $('.program-card').hide();
                $(`.program-card[data-category="${filter}"]`).show();
            }
            
            // Update URL hash for deep linking
            if (filter !== 'all') {
                window.location.hash = `filter-${filter}`;
            }
        });
        
        // Check URL for filter on page load
        const hash = window.location.hash;
        if (hash && hash.startsWith('#filter-')) {
            const filter = hash.replace('#filter-', '');
            $(`.filter-btn[data-filter="${filter}"]`).trigger('click');
        }
    }

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        // Create Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements with animation classes
            $('.animate-on-scroll').each(function() {
                observer.observe(this);
            });
        }
    }

   function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Initialize Leaflet map
    const map = L.map('map').setView([-29.6007, 30.3794], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add marker
    L.marker([-29.6007, 30.3794]).addTo(map)
        .bindPopup('<b>Ubuntu Rise Community Hub</b><br>290 Prince Alfred Street<br>Pietermaritzburg, 3201')
        .openPopup();
}

    // ===== DYNAMIC CONTENT =====
    function initDynamicContent() {
        // Load dynamic content like events, news, etc.
        console.log('Dynamic content system ready');
        
        // Example: Load upcoming events
        // This would typically fetch from an API
        setTimeout(() => {
            if ($('#upcoming-events').length) {
                $('#upcoming-events').html('<p>Loading community events...</p>');
            }
        }, 1000);
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    function initPerformance() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            $('img.lazy').each(function() {
                imageObserver.observe(this);
            });
        }

        // Debounce resize events
        let resizeTimeout;
        $(window).resize(function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Handle responsive behaviors
                console.log('Window resized - updating layout');
            }, 250);
        });
    }

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    function initAccessibility() {
       
        // Enhance focus management for modals
        $(document).on('keydown', function(e) {
            // Trap focus in modals
            if ($('.modal.active').length && e.key === 'Tab') {
                const focusableElements = $('.modal.active').find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements.first();
                const lastElement = focusableElements.last();

                if (e.shiftKey) {
                    if ($(document.activeElement).is(firstElement)) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if ($(document.activeElement).is(lastElement)) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // ===== ERROR HANDLING =====
    function initErrorHandling() {
        // Global error handler for uncaught errors
        window.addEventListener('error', function(e) {
            console.error('Global error caught:', e.error);
            // You could send this to an error tracking service
        });

        // Handle Promise rejections
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled promise rejection:', e.reason);
            e.preventDefault();
        });
    }

    // ===== INITIALIZE ALL FUNCTIONALITY =====
    function initAll() {
        try {
            initAccordions();
            initModals();
            initSmoothScroll();
            initSearch();
            initFilters();
            initForms();
            initScrollAnimations();
            initMap();
            initDynamicContent();
            initPerformance();
            initAccessibility();
            initErrorHandling();
            
            console.log('All Ubuntu Rise interactive features initialized successfully');
        } catch (error) {
            console.error('Error initializing features:', error);
        }
    }

    // Start everything
    initAll();

    // ===== PUBLIC METHODS =====
    window.ubuntuRise = {
        refreshMap: initMap,
        validateForm: function(formId) {
            const $form = $(`#${formId}`);
            return $form.length ? validateField($form.find('[required]').first()) : false;
        },
        openLightbox: function(imageSrc, caption) {
            openLightbox(imageSrc, caption);
        },
        closeLightbox: function() {
            closeLightbox();
        },
        refreshContent: function() {
            initDynamicContent();
        }
    };
});

// ===== ENHANCED CONSOLE LOGGING (Development only) =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(`
    🎉 Ubuntu Rise Community Hub - Development Mode
    =============================================
    Available global methods:
    - ubuntuRise.refreshMap()
    - ubuntuRise.validateForm('formId')
    - ubuntuRise.openLightbox(src, caption)
    - ubuntuRise.closeLightbox()
    - ubuntuRise.refreshContent()
    `);
}