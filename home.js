document.addEventListener('DOMContentLoaded', () => {
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

    resetAutoSlide();

    carousel.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    carousel.addEventListener('mouseleave', resetAutoSlide);
}

