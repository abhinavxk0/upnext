document.addEventListener('DOMContentLoaded', () => {
    loadUserPreferences();
    setupSidebar();
    checkNotificationPermission();
    loadSettings();

    // Event listeners for settings changes
    document.getElementById('notifications').addEventListener('change', (e) => {
        appState.userPreferences.notifications = e.target.checked;
        saveUserPreferences();
    });

    document.getElementById('notification-timing').addEventListener('change', (e) => {
        appState.userPreferences.notificationTiming = e.target.value;
        saveUserPreferences();
    });

    // Request notification permission
    document.getElementById('request-permission').addEventListener('click', () => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    appState.userPreferences.notifications = true;
                    saveUserPreferences();
                    alert('Notifications enabled.');
                } else {
                    alert('Notification permission denied.');
                }
            });
        } else {
            alert('Notifications permission already granted.');
        }
    });

    // Export data
    document.getElementById('export-data').addEventListener('click', () => {
        const dataStr = JSON.stringify(appState.userPreferences);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'upnext_preferences.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Import data
    document.getElementById('import-data').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const importedPrefs = JSON.parse(event.target.result);
                    appState.userPreferences = { ...appState.userPreferences, ...importedPrefs };
                    saveUserPreferences();
                    alert('Preferences imported successfully.');
                    loadSettings(); // Reload settings to reflect changes
                } catch (error) {
                    alert('Invalid file format.');
                }
            };
            reader.readAsText(file);
        }
    });

    // Clear all data
    document.getElementById('clear-data').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all data? This will reset all your preferences.')) {
            appState.userPreferences = {
                interests: [],
                notifications: true,
                notificationTiming: '24',
                savedEvents: []
            };
            saveUserPreferences();
            loadSettings();
            alert('All data cleared.');
        }
    });
});

function loadSettings() {
    document.getElementById('notifications').checked = appState.userPreferences.notifications;
    document.getElementById('notification-timing').value = appState.userPreferences.notificationTiming;
}

function loadUserPreferences() {
    // Load preferences from localStorage or initialize defaults
    appState.userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {
        interests: [],
        notifications: true,
        notificationTiming: '24',
        savedEvents: []
    };
}

function saveUserPreferences() {
    // Save preferences to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(appState.userPreferences));
}

function setupSidebar() {
    // Placeholder for sidebar setup (e.g., toggle functionality)
    const toggleBtn = document.getElementById('new-toggleBtn');
    const sidebar = document.getElementById('new-sidebar');
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

function checkNotificationPermission() {
    // Check and update notification permission status
    if (Notification.permission === 'granted') {
        appState.userPreferences.notifications = true;
    } else {
        appState.userPreferences.notifications = false;
    }
}