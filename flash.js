
document.addEventListener('DOMContentLoaded', () => {
    setupSidebar();
    loadFlashContent();
    setupFilters();

    // Event listeners for filter changes
    document.getElementById('show-notices').addEventListener('change', loadFlashContent);
    document.getElementById('show-updates').addEventListener('change', loadFlashContent);
    document.getElementById('category-filter').addEventListener('change', loadFlashContent);
});

function setupSidebar() {
    const toggleBtn = document.getElementById('new-toggleBtn');
    const sidebar = document.getElementById('new-sidebar');
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('.new-collapsed');
        const container = document.querySelector('.container');
        container.style.paddingLeft = sidebar.classList.contains('new-collapsed') ? '70px' : '250px';
    });
}

function loadFlashContent() {
    const noticesContainer = document.getElementById('flash-notices');
    const updatesContainer = document.getElementById('flash-updates');
    const showNotices = document.getElementById('show-notices').checked;
    const showUpdates = document.getElementById('show-updates').checked;
    const category = document.getElementById('category-filter').value;

    // Clear existing content
    noticesContainer.innerHTML = '';
    updatesContainer.innerHTML = '';

    // Sample data (replace with actual API call or data source)
    const flashData = {
        notices: [
            { id: 1, title: 'Bosco Chriz 2025', content: 'Students interested must attend a meeting after school in classroom 11-D.', category: 'announcements', date: '2025-11-01' },
            { id: 2, title: 'Server Maintenance', content: 'Scheduled maintenance on Nov 10, 2025.', category: 'announcements', date: '2025-11-01' },
            { id: 3, title: 'New Feature Alert', content: 'Flash Updates added!', category: 'updates', date: '2025-10-28' }
        ],
        updates: [
            { id: 3, title: 'Event Reminder', content: 'Hackathon starts tomorrow!', category: 'events', date: '2025-11-05' },
            { id: 4, title: 'Profile Update', content: 'New badge system introduced.', category: 'updates', date: '2025-11-03' }
        ]
    };

    // Filter and render notices
    if (showNotices) {
        const filteredNotices = flashData.notices.filter(item => category === 'all' || item.category === category);
        if (filteredNotices.length === 0) {
            noticesContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-bell empty-state-icon"></i>
                            <h3>No Notices Available</h3>
                            <p>Check back later for important announcements.</p>
                        </div>`;
        } else {
            filteredNotices.forEach(notice => {
                const noticeElement = document.createElement('div');
                noticeElement.className = 'flash-item card';
                noticeElement.innerHTML = `
                            <div class="card-content">
                                <h3 class="card-title">${notice.title}</h3>
                                <p class="card-description">${notice.content}</p>
                                <div class="card-actions">
                                    <span class="card-subtitle">${notice.date}</span>
                                    <span class="badge">${notice.category}</span>
                                </div>
                            </div>`;
                noticesContainer.appendChild(noticeElement);
            });
        }
    } else {
        noticesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-bell empty-state-icon"></i>
                        <h3>Notices Hidden</h3>
                        <p>Enable notices in filters to view them.</p>
                    </div>`;
    }

    // Filter and render updates
    if (showUpdates) {
        const filteredUpdates = flashData.updates.filter(item => category === 'all' || item.category === category);
        if (filteredUpdates.length === 0) {
            updatesContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-rss empty-state-icon"></i>
                            <h3>No Updates Available</h3>
                            <p>Check back later for quick updates.</p>
                        </div>`;
        } else {
            filteredUpdates.forEach(update => {
                const updateElement = document.createElement('div');
                updateElement.className = 'flash-item card';
                updateElement.innerHTML = `
                            <div class="card-content">
                                <h3 class="card-title">${update.title}</h3>
                                <p class="card-description">${update.content}</p>
                                <div class="card-actions">
                                    <span class="card-subtitle">${update.date}</span>
                                    <span class="badge">${update.category}</span>
                                </div>
                            </div>`;
                updatesContainer.appendChild(updateElement);
            });
        }
    } else {
        updatesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-rss empty-state-icon"></i>
                        <h3>Updates Hidden</h3>
                        <p>Enable updates in filters to view them.</p>
                    </div>`;
    }
}

function setupFilters() {
    // Initialize filter states from user preferences if available
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    if (userPreferences.flashFilters) {
        document.getElementById('show-notices').checked = userPreferences.flashFilters.showNotices ?? true;
        document.getElementById('show-updates').checked = userPreferences.flashFilters.showUpdates ?? true;
        document.getElementById('category-filter').value = userPreferences.flashFilters.category ?? 'all';
    }

    // Save filter changes to user preferences
    document.querySelectorAll('#show-notices, #show-updates, #category-filter').forEach(element => {
        element.addEventListener('change', () => {
            const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
            userPreferences.flashFilters = {
                showNotices: document.getElementById('show-notices').checked,
                showUpdates: document.getElementById('show-updates').checked,
                category: document.getElementById('category-filter').value
            };
            localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
        });
    });
}