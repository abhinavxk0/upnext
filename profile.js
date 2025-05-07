document.addEventListener('DOMContentLoaded', () => {
    loadUserPreferences();
    setupSidebar();
    checkNotificationPermission();
    renderProfile();
});

function renderProfile() {
    const savedEvents = eventsData.filter(event => appState.userPreferences.savedEvents.includes(event.id));

    const notificationsToggle = document.getElementById('notifications-toggle');
    notificationsToggle.checked = appState.userPreferences.notifications;

    const notificationTiming = document.getElementById('notification-timing');
    notificationTiming.value = appState.userPreferences.notificationTiming;

    document.querySelectorAll('.interest-item input').forEach(checkbox => {
        const interest = checkbox.id.replace('interest-', '');
        checkbox.checked = appState.userPreferences.interests.includes(interest);
    });

    const savedEventsContainer = document.getElementById('saved-events');
    savedEventsContainer.innerHTML = savedEvents.length > 0 ? savedEvents.map(event => `
        <div class="card">
            <div class="card-content">
                <h3 class="card-title">${event.title}</h3>
                <p class="card-subtitle">${formatDate(event.date)} • ${formatTime(event.time)}</p>
                <button class="btn btn-primary" data-event-id="${event.id}" aria-label="View details for ${event.title}">View Details</button>
                <button class="btn btn-outline" data-event-id="${event.id}" style="margin-top: 8px;" aria-label="Remove ${event.title} from saved events">Remove</button>
            </div>
        </div>
    `).join('') : '<p>No saved events.</p>';

    const clearSavedBtn = document.getElementById('clear-saved-btn');
    clearSavedBtn.disabled = savedEvents.length === 0;

    // Setup event listeners
    document.getElementById('logout-btn').addEventListener('click', () => {
        appState.userPreferences = {
            interests: [],
            notifications: true,
            notificationTiming: '24',
            savedEvents: []
        };
        saveUserPreferences();
        window.location.href = 'index.html';
    });

    document.querySelectorAll('.interest-item input').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const interest = checkbox.id.replace('interest-', '');
            const interests = appState.userPreferences.interests;
            if (checkbox.checked) {
                if (!interests.includes(interest)) {
                    interests.push(interest);
                }
            } else {
                const index = interests.indexOf(interest);
                if (index !== -1) {
                    interests.splice(index, 1);
                }
            }
            saveUserPreferences();
        });
    });

    notificationsToggle.addEventListener('change', (e) => {
        appState.userPreferences.notifications = e.target.checked;
        saveUserPreferences();
        if (e.target.checked) {
            checkNotificationPermission();
        } else {
            const scheduledNotifications = JSON.parse(sessionStorage.getItem('scheduledNotifications') || '{}');
            Object.values(scheduledNotifications).forEach(timeoutId => clearTimeout(timeoutId));
            sessionStorage.setItem('scheduledNotifications', '{}');
        }
    });

    notificationTiming.addEventListener('change', (e) => {
        appState.userPreferences.notificationTiming = e.target.value;
        saveUserPreferences();

        // Reschedule notifications
        const savedEvents = appState.userPreferences.savedEvents;
        const scheduledNotifications = JSON.parse(sessionStorage.getItem('scheduledNotifications') || '{}');
        Object.values(scheduledNotifications).forEach(timeoutId => clearTimeout(timeoutId));
        sessionStorage.setItem('scheduledNotifications', '{}');

        savedEvents.forEach(eventId => {
            const event = eventsData.find(e => e.id === eventId);
            if (event) {
                scheduleNotification(event);
            }
        });
    });

    clearSavedBtn.addEventListener('click', () => {
        appState.userPreferences.savedEvents = [];
        saveUserPreferences();
        renderProfile();
    });

    document.querySelectorAll('.saved-events .btn').forEach(btn => {
        const eventId = parseInt(btn.getAttribute('data-event-id'));
        if (btn.textContent === 'View Details') {
            btn.addEventListener('click', () => {
                window.location.href = `event.html?id=${eventId}`;
            });
        } else if (btn.textContent === 'Remove') {
            btn.addEventListener('click', () => {
                toggleEventNotification(eventId);
                renderProfile();
            });
        }
    });
}