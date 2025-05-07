document.addEventListener('DOMContentLoaded', () => {
    // Check if this is the user's first visit
    if (!localStorage.getItem('hasVisited')) {
        localStorage.setItem('hasVisited', 'true');
        window.location.href = '/login.html';
        return;
    }

    loadUserPreferences();
    setupSidebar();
    checkNotificationPermission();
    renderFlash();
});

function renderFlash() {
    const flashItems = getLatestFlashItems(10); // Get latest 10 updates/notices
    const flashGrid = document.getElementById('flash-grid');

    flashGrid.innerHTML = flashItems.length > 0 ? flashItems.map(item => `
        <div class="flash-card">
            <div class="flash-content">
                <h3 class="flash-title">${item.title}</h3>
                <p class="flash-meta">${formatDate(item.date)} • ${item.category}</p>
                <p class="flash-description">${item.description}</p>
            </div>
        </div>
    `).join('') : `
        <div class="empty-state">
            <i class="fas fa-bolt empty-state-icon"></i>
            <h3>No Updates Available</h3>
            <p>Check back later for the latest notices and updates!</p>
        </div>
    `;
}

// Get latest flash items
function getLatestFlashItems(limit = 10) {
    return flashData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

const flashData = [
    { id: 1, title: "School Closed Tomorrow", date: "2025-05-08", category: "Notice", description: "Due to heavy rain, school will remain closed." },
    { id: 2, title: "Exam Schedule Update", date: "2025-05-07", category: "Update", description: "Mid-term exams rescheduled to next week." },
  ];