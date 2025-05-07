document.addEventListener('DOMContentLoaded', () => {
    loadUserPreferences();
    setupSidebar();
    checkNotificationPermission();
    renderEvents();
});

function renderEvents() {
    const urlParams = new URLSearchParams(window.location.search);
    const filters = {
        category: urlParams.get('category') || '',
        search: urlParams.get('search') || '',
        dateRange: urlParams.get('dateRange') || '',
        location: urlParams.get('location') || ''
    };
    const sortBy = urlParams.get('sort') || 'date';
    const currentPage = parseInt(urlParams.get('page')) || 1;
    const eventsPerPage = 4;

    // Populate filter modal
    document.getElementById('category-filter').value = filters.category;
    document.getElementById('date-filter').value = filters.dateRange;
    document.getElementById('sort-by').value = sortBy;
    document.getElementById('events-search').value = filters.search;

    const locationFilter = document.getElementById('location-filter');
    locationFilter.innerHTML = `<option value="">All Locations</option>` + 
        [...new Set(eventsData.map(event => event.location))].map(location => `
            <option value="${location}" ${filters.location === location ? 'selected' : ''}>${location}</option>
        `).join('');

    let events = filterEvents(filters);
    events = sortEvents(events, sortBy);

    // Calculate pagination
    const totalEvents = events.length;
    const totalPages = Math.ceil(totalEvents / eventsPerPage);
    const start = (currentPage - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    const paginatedEvents = events.slice(start, end);

    const eventsGrid = document.getElementById('events-grid');
    eventsGrid.innerHTML = paginatedEvents.length > 0 ? paginatedEvents.map(event => `
        <div class="card event-card">
            <img src="${event.image}" alt="Event: ${event.title}" class="card-img" loading="lazy">
            <div class="card-content">
                <h3 class="card-title">${event.title}</h3>
                <p class="card-subtitle">${formatDate(event.date)} • ${formatTime(event.time)}</p>
                <p class="card-subtitle">${event.location}</p>
                <div class="card-actions">
                    <button class="btn btn-primary" data-event-id="${event.id}" aria-label="View details for ${event.title}">View Details</button>
                    <div class="notify-badge ${appState.userPreferences.savedEvents.includes(event.id) ? 'active' : ''}" data-event-id="${event.id}" title="Get notified" role="button" aria-label="Toggle notification for ${event.title}">
                        <i class="fas fa-bell"></i>
                    </div>
                    <div class="save-badge ${appState.userPreferences.savedEvents.includes(event.id) ? 'active' : ''}" data-event-id="${event.id}" title="Save event" role="button" aria-label="Toggle save for ${event.title}">
                        <i class="fas fa-bookmark"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('') : `
        <div class="no-events">
            <i class="fas fa-calendar-times" style="font-size: 48px; margin-bottom: 16px;"></i>
            <h2>No Events Found</h2>
            <p>Try changing your filters or search criteria.</p>
        </div>
    `;

    const pagination = document.getElementById('events-pagination');
    pagination.innerHTML = totalEvents > 0 ? `
        <div class="pagination-item ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}" aria-label="Previous page">
            <i class="fas fa-chevron-left"></i>
        </div>
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
            <div class="pagination-item ${page === currentPage ? 'active' : ''}" data-page="${page}" aria-label="Page ${page}">
                ${page}
            </div>
        `).join('')}
        <div class="pagination-item ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}" aria-label="Next page">
            <i class="fas fa-chevron-right"></i>
        </div>
    ` : '';

    // Setup event listeners
    document.querySelectorAll('#events-grid .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const eventId = parseInt(btn.getAttribute('data-event-id'));
            window.location.href = `event.html?id=${eventId}`;
        });
    });

    document.querySelectorAll('.notify-badge').forEach(badge => {
        badge.addEventListener('click', (e) => {
            const eventId = parseInt(badge.getAttribute('data-event-id'));
            const isActive = toggleEventNotification(eventId);
            badge.classList.toggle('active', isActive);
        });
    });

    document.querySelectorAll('.save-badge').forEach(badge => {
        badge.addEventListener('click', (e) => {
            const eventId = parseInt(badge.getAttribute('data-event-id'));
            const isActive = toggleSaveEvent(eventId);
            badge.classList.toggle('active', isActive);
        });
    });

    document.querySelectorAll('#events-pagination .pagination-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = parseInt(item.getAttribute('data-page'));
            if (!item.classList.contains('disabled')) {
                let url = 'events.html?';
                const params = [];

                if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
                if (filters.category) params.push(`category=${encodeURIComponent(filters.category)}`);
                if (filters.dateRange) params.push(`dateRange=${encodeURIComponent(filters.dateRange)}`);
                if (filters.location) params.push(`location=${encodeURIComponent(filters.location)}`);
                if (sortBy) params.push(`sort=${encodeURIComponent(sortBy)}`);
                params.push(`page=${page}`);

                url += params.join('&');
                window.location.href = url;
            }
        });
    });

    // Setup filter modal
    const filterBtn = document.getElementById('filter-btn');
    const filterModal = document.getElementById('filter-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    function applyFilters() {
        const search = document.getElementById('events-search').value;
        const category = document.getElementById('category-filter').value;
        const dateRange = document.getElementById('date-filter').value;
        const location = document.getElementById('location-filter').value;
        const sortBy = document.getElementById('sort-by').value;

        let url = 'events.html?';
        const params = [];

        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        if (dateRange) params.push(`dateRange=${encodeURIComponent(dateRange)}`);
        if (location) params.push(`location=${encodeURIComponent(location)}`);
        if (sortBy) params.push(`sort=${encodeURIComponent(sortBy)}`);
        params.push('page=1');

        url += params.join('&');
        window.location.href = url;
    }

    filterBtn.addEventListener('click', () => {
        filterModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    modalCloseBtn.addEventListener('click', () => {
        filterModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    filterModal.addEventListener('click', (e) => {
        if (e.target === filterModal) {
            filterModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    applyFiltersBtn.addEventListener('click', () => {
        applyFilters();
        filterModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    clearFiltersBtn.addEventListener('click', () => {
        document.getElementById('category-filter').value = '';
        document.getElementById('date-filter').value = '';
        document.getElementById('location-filter').value = '';
        document.getElementById('sort-by').value = 'date';
        document.getElementById('events-search').value = '';
        window.location.href = 'events.html?page=1';
        filterModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    document.getElementById('events-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}