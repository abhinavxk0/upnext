document.addEventListener('DOMContentLoaded', () => {
    loadUserPreferences();
    setupSidebar();
    checkNotificationPermission();
    renderEventDetails();
});

function renderEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));
    const event = eventsData.find(e => e.id === eventId);
    const relatedEvents = getRelatedEvents(eventId);

    const container = document.getElementById('event-details-container');

    if (!event) {
        container.innerHTML = `
            <div class="container">
                <h1>Event Not Found</h1>
                <p>The event you're looking for doesn't exist.</p>
                <button class="btn btn-primary" id="back-btn" aria-label="Go back">Back to Events</button>
            </div>
        `;
        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.href = 'events.html';
        });
        return;
    }

    container.innerHTML = `
        <div class="event-header">
            <img src="${event.image}" alt="Event: ${event.title}" loading="lazy">
            <div class="event-header-overlay">
                <button class="btn btn-outline" id="back-btn" style="align-self: flex-start;" aria-label="Go back">Back</button>
                <h1>${event.title}</h1>
            </div>
        </div>
        
        <div class="event-details">
            <div class="event-meta">
                <div class="event-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(event.date)}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${formatTime(event.time)}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    ${event.location}
                </div>
            </div>
            
            <p class="card-description">${event.description}</p>
            
            <div class="event-meta">
                <div class="event-meta-item">
                    <i class="fas fa-user"></i>
                    <span>Organized by ${event.organizer}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-envelope"></i>
                    <a href="mailto:${event.contact}" aria-label="Contact ${event.organizer}">${event.contact}</a>
                </div>
            </div>
            
            <div class="event-actions">
                <button class="btn btn-primary" id="add-to-calendar" aria-label="Add ${event.title} to calendar">Add to Calendar</button>
                <div class="notify-badge ${appState.userPreferences.savedEvents.includes(event.id) ? 'active' : ''}" id="notify-btn" title="Get notified" role="button" aria-label="Toggle notification for ${event.title}">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="save-badge ${appState.userPreferences.savedEvents.includes(event.id) ? 'active' : ''}" id="save-btn" title="Save event" role="button" aria-label="Toggle save for ${event.title}">
                    <i class="fas fa-bookmark"></i>
                </div>
            </div>
            
            ${relatedEvents.length > 0 ? `
                <div class="related-events">
                    <h2 class="section-title">Related Events</h2>
                    <div class="related-events-scroll">
                        ${relatedEvents.map(related => `
                            <div class="card">
                                <img src="${related.image}" alt="Event: ${related.title}" class="card-img" loading="lazy">
                                <div class="card-content">
                                    <h3 class="card-title">${related.title}</h3>
                                    <p class="card-subtitle">${formatDate(related.date)} • ${formatTime(related.time)}</p>
                                    <button class="btn btn-primary" data-event-id="${related.id}" aria-label="View details for ${related.title}">View Details</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    // Setup event listeners
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'events.html';
    });

    document.getElementById('add-to-calendar').addEventListener('click', () => {
        addToCalendar(event);
    });

    document.getElementById('notify-btn').addEventListener('click', () => {
        const isActive = toggleEventNotification(event.id);
        document.getElementById('notify-btn').classList.toggle('active', isActive);
    });

    document.getElementById('save-btn').addEventListener('click', () => {
        const isActive = toggleSaveEvent(event.id);
        document.getElementById('save-btn').classList.toggle('active', isActive);
    });

    document.querySelectorAll('.related-events .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const relatedId = parseInt(btn.getAttribute('data-event-id'));
            window.location.href = `event.html?id=${relatedId}`;
        });
    });
}