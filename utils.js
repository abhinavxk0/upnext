const appState = {
    userPreferences: {
        interests: [],
        notifications: true,
        notificationTiming: '24',
        savedEvents: []
    }
};

// Load user preferences from local storage
function loadUserPreferences() {
    const savedPrefs = localStorage.getItem('Upnext_preferences');
    if (savedPrefs) {
        try {
            appState.userPreferences = JSON.parse(savedPrefs);
        } catch (e) {
            console.error('Failed to parse saved preferences:', e);
        }
    }
}

// Save user preferences to local storage
function saveUserPreferences() {
    localStorage.setItem('Upnext_preferences', JSON.stringify(appState.userPreferences));
}

// Check notification permission
function checkNotificationPermission() {
    if (appState.userPreferences.notifications && Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
                appState.userPreferences.notifications = false;
                saveUserPreferences();
                alert('Notifications are disabled. Enable them in your browser settings or in your profile.');
            }
        });
    }
}

// Schedule a notification for an event
function scheduleNotification(event) {
    if (!appState.userPreferences.notifications || Notification.permission !== 'granted') {
        return;
    }

    const eventDate = new Date(`${event.date}T${event.time}`);
    const hoursBeforeEvent = parseInt(appState.userPreferences.notificationTiming);

    // Calculate notification time
    const notificationTime = new Date(eventDate.getTime() - (hoursBeforeEvent * 60 * 60 * 1000));

    // If notification time is in the future, schedule it
    if (notificationTime > new Date()) {
        const timeoutId = setTimeout(() => {
            new Notification(`Upnext: ${event.title}`, {
                body: `${event.title} is happening ${hoursBeforeEvent === 1 ? 'in an hour' : `in ${hoursBeforeEvent} hours`} at ${event.location}!`,
                icon: event.image
            });
        }, notificationTime.getTime() - new Date().getTime());

        // Store timeoutId in sessionStorage
        const scheduledNotifications = JSON.parse(sessionStorage.getItem('scheduledNotifications') || '{}');
        scheduledNotifications[event.id] = timeoutId;
        sessionStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
    }
}

// Cancel a scheduled notification
function cancelNotification(eventId) {
    const scheduledNotifications = JSON.parse(sessionStorage.getItem('scheduledNotifications') || '{}');
    if (scheduledNotifications[eventId]) {
        clearTimeout(scheduledNotifications[eventId]);
        delete scheduledNotifications[eventId];
        sessionStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
    }
}

// Add event to Google Calendar
function addToCalendar(event) {
    const startDate = new Date(`${event.date}T${event.time}`);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2); // Assume 2-hour duration

    // Format dates to YYYYMMDDTHHMMSSZ
    const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(event.title)}` +
        `&dates=${formatDate(startDate)}/${formatDate(endDate)}` +
        `&details=${encodeURIComponent(event.description)}` +
        `&location=${encodeURIComponent(event.location)}` +
        `&sf=true&output=xml`;

    window.open(googleCalendarUrl, '_blank');
}

// Toggle event notification
function toggleEventNotification(eventId) {
    const savedEvents = appState.userPreferences.savedEvents;
    const index = savedEvents.indexOf(eventId);

    if (index === -1) {
        savedEvents.push(eventId);
        saveUserPreferences();

        const event = eventsData.find(e => e.id === eventId);
        if (event) {
            scheduleNotification(event);
        }

        return true;
    } else {
        savedEvents.splice(index, 1);
        saveUserPreferences();

        cancelNotification(eventId);

        return false;
    }
}

// Toggle save event
function toggleSaveEvent(eventId) {
    const savedEvents = appState.userPreferences.savedEvents;
    const index = savedEvents.indexOf(eventId);

    if (index === -1) {
        savedEvents.push(eventId);
        saveUserPreferences();
        return true;
    } else {
        savedEvents.splice(index, 1);
        saveUserPreferences();
        return false;
    }
}

// Filter events
function filterEvents(filters = {}) {
    return eventsData.filter(event => {
        if (filters.category && event.category !== filters.category) {
            return false;
        }

        if (filters.dateRange) {
            const today = new Date().toISOString().split('T')[0];
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            const nextWeekStr = nextWeek.toISOString().split('T')[0];

            if (filters.dateRange === 'today' && event.date !== today) {
                return false;
            } else if (filters.dateRange === 'week' && (event.date < today || event.date > nextWeekStr)) {
                return false;
            }
        }

        if (filters.location && event.location.toLowerCase().indexOf(filters.location.toLowerCase()) === -1) {
            return false;
        }

        if (filters.search && event.title.toLowerCase().indexOf(filters.search.toLowerCase()) === -1 &&
            event.description.toLowerCase().indexOf(filters.search.toLowerCase()) === -1) {
            return false;
        }

        return true;
    });
}

// Sort events
function sortEvents(events, sortBy = 'date') {
    const sortedEvents = [...events];

    switch (sortBy) {
        case 'date':
            sortedEvents.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA - dateB;
            });
            break;
        case 'name':
            sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }

    return sortedEvents;
}

// Get upcoming events
function getUpcomingEvents(limit = 5) {
    const today = new Date().toISOString().split('T')[0];

    return eventsData
        .filter(event => event.date >= today)
        .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        })
        .slice(0, limit);
}

// Get related events
function getRelatedEvents(eventId, limit = 3) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return [];

    return eventsData
        .filter(e => e.id !== eventId && e.category === event.category)
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

// Format time for display
function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Setup sidebar functionality
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
        });

        // Check saved sidebar state
        const sidebarCollapsed = localStorage.getItem('sidebar_collapsed');
        if (sidebarCollapsed === 'true') {
            sidebar.classList.add('collapsed');
        }
    }
}

// Toggle sidebar collapse
const sidebar = document.getElementById('new-sidebar');
const toggleBtn = document.getElementById('new-toggleBtn');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('new-collapsed');
});