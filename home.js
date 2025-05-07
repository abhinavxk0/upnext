document.addEventListener('DOMContentLoaded', () => {
    // Check if this is the user's first visit
    if (!localStorage.getItem('hasVisited')) {
        localStorage.setItem('hasVisited', 'true'); // Mark as visited
        window.location.href = '/login.html'; // Redirect to login
        return; // Exit to prevent further execution
    }

    loadUserPreferences();
    setupSidebar();
    checkNotificationPermission();
    renderHome();
});

function renderHome() {
    const upcoming = getUpcomingEvents(5);
    const carouselInner = document.getElementById('featured-carousel');
    const carouselDots = document.getElementById('carousel-dots');

    carouselInner.innerHTML = upcoming.length > 0 ? upcoming.map((event, index) => `
        <div class="carousel-slide">
            <div class="card">
                <img src="${event.image}" alt="Event: ${event.title}" class="card-img" loading="lazy">
                <div class="card-content">
                    <h3 class="card-title">${event.title}</h3>
                    <p class="card-subtitle">${formatDate(event.date)} • ${formatTime(event.time)}</p>
                    <button class="btn btn-primary" data-event-id="${event.id}" aria-label="View for ${event.title}">View</button>
                </div>
            </div>
        </div>
    `).join('') : '<p>No upcoming events available.</p>';

    carouselDots.innerHTML = upcoming.map((_, index) => `
        <div class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}" role="button" aria-label="Go to slide ${index + 1}"></div>
    `).join('');

    // Setup event listeners
    document.getElementById('home-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.trim();
            if (searchTerm) {
                window.location.href = `events.html?search=${encodeURIComponent(searchTerm)}`;
            }
        }
    });

    document.querySelectorAll('.card .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const eventId = parseInt(btn.getAttribute('data-event-id'));
            window.location.href = `event.html?id=${eventId}`;
        });
    });

    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.getAttribute('data-category');
            window.location.href = `events.html?category=${encodeURIComponent(category)}`;
        });
    });

    setupCarousel();
}

function setupCarousel() {
    const carousel = document.getElementById('featured-carousel');
    const dots = document.querySelectorAll('#carousel-dots .carousel-dot');
    if (!carousel || dots.length === 0) return;

    let currentSlide = 0;
    let autoSlideInterval;
    let startX = 0;
    let isSwiping = false;
    const swipeThreshold = 50; // Minimum distance in pixels to trigger a swipe

    // Add grab cursor style
    carousel.style.cursor = 'grab';
    carousel.addEventListener('mousedown', () => carousel.style.cursor = 'grabbing');
    carousel.addEventListener('mouseup', () => carousel.style.cursor = 'grab');

    function showSlide(index) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showSlide(index);
            resetAutoSlide();
        });
    });

    function autoSlide() {
        showSlide(currentSlide + 1);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(autoSlide, 5000);
    }

    // Swipe functionality for pointer events
    carousel.addEventListener('pointerdown', (e) => {
        startX = e.clientX;
        isSwiping = true;
        carousel.style.cursor = 'grabbing';
        clearInterval(autoSlideInterval);
    });

    carousel.addEventListener('pointermove', (e) => {
        if (!isSwiping) return;
        e.preventDefault(); // Prevent text selection during swipe
    });

    carousel.addEventListener('pointerup', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        carousel.style.cursor = 'grab';
        const endX = e.clientX;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
                showSlide(currentSlide - 1); // Swipe right, go to previous slide
            } else {
                showSlide(currentSlide + 1); // Swipe left, go to next slide
            }
        }
        resetAutoSlide();
    });

    carousel.addEventListener('pointerleave', () => {
        if (isSwiping) {
            isSwiping = false;
            carousel.style.cursor = 'grab';
            resetAutoSlide();
        }
    });

    // Swipe functionality for touch events
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        clearInterval(autoSlideInterval);
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        e.preventDefault(); // Prevent scrolling during swipe
    });

    carousel.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
                showSlide(currentSlide - 1); // Swipe right, go to previous slide
            } else {
                showSlide(currentSlide + 1); // Swipe left, go to next slide
            }
        }
        resetAutoSlide();
    });

    resetAutoSlide();

    carousel.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    carousel.addEventListener('mouseleave', resetAutoSlide);
}