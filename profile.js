document.addEventListener('DOMContentLoaded', () => {
    loadUserPreferences();
    setupSidebar();
    checkNotificationPermission();
    renderProfile();
});

function renderProfile() {
    const savedEvents = eventsData.filter(event => appState.userPreferences.savedEvents.includes(event.id));

    document.querySelectorAll('.interest-item input').forEach(checkbox => {
        const interest = checkbox.id.replace('interest-', '');
        checkbox.checked = appState.userPreferences.interests.includes(interest);
    });

    const savedEventsContainer = document.getElementById('saved-events');
    savedEventsContainer.innerHTML = savedEvents.length > 0 ? savedEvents.map(event => `
        <div class="card" style="background-image: url('${event.image}'); background-size: cover; background-position: center; backdrop-filter: blur(1000px);">
            <div class="card-content" style="display: flex; flex-direction: column; justify-content: flex-end; height: 100%; background: rgba(0, 0, 0, 0.5);">
                <h3 class="card-title" style="font-size: 1.25rem; margin-bottom: var(--space-2);">${event.title}</h3>
                <p class="card-subtitle" style="font-size: 0.9375rem; margin-bottom: var(--space-3);">${formatDate(event.date)} • ${formatTime(event.time)}</p>
                <div style="display: flex; gap: var(--space-2);">
                    <button class="btn btn-primary" data-event-id="${event.id}" aria-label="View for ${event.title}" style="font-size: 0.875rem;">View</button>
                    <button class="btn btn-outline" data-event-id="${event.id}" aria-label="Remove ${event.title} from saved events" style="font-size: 0.875rem;">Remove</button>
                </div>
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

    clearSavedBtn.addEventListener('click', () => {
        appState.userPreferences.savedEvents = [];
        saveUserPreferences();
        renderProfile();
    });

    document.querySelectorAll('.saved-events .btn').forEach(btn => {
        const eventId = parseInt(btn.getAttribute('data-event-id'));
        if (btn.textContent === 'View') {
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

const navbar_profile = document.getElementById('');