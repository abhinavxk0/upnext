# Upnext Website

## Project Overview
Upnext is a web application designed for students to discover, save, and manage events happening at their schools. It provides a user-friendly platform to explore events, set preferences for interests, manage notifications, and save events of interest. The target audience includes students from various schools, allowing them to engage with school-related activities. The website features a modern design with a responsive layout, ensuring accessibility on both desktop and mobile devices.

## Features
- **User Authentication**: Login and signup functionality for students to access personalized features.
- **Event Management**: Browse and save events, with the ability to view saved events on the profile page.
- **User Preferences**: Customize interests and notification settings, such as enabling/disabling notifications and setting notification timing.
- **Notifications**: Schedule and manage event notifications using browser notifications.
- **Responsive Design**: A sidebar for desktop navigation and a bottom navigation bar for mobile devices.
- **Settings**: Manage user data (export/import preferences, clear data) and view app information.
- **Event Filtering**: Filter events by category, date, location, and search terms (functionality defined in `utils.js`).

## File Structure
- **`index.html`**: The homepage of the website (not provided but referenced in navigation).
- **`login.html`**: The login page for user authentication.
- **`signup.html`**: The signup page for new user registration, including school and class selection.
- **`profile.html`**: The user profile page displaying saved events and user information.
- **`profile.js`**: JavaScript for the profile page, handling rendering of saved events and user preferences.
- **`settings.html`**: The settings page for managing notifications and user data.
- **`settings.js`**: JavaScript for the settings page, handling user preferences, data export/import, and notification permissions.
- **`events.html`**: Page for browsing events (not provided but referenced in navigation).
- **`flash.html`**: Page for flash events (not provided but referenced in navigation).
- **`event.html`**: Page for viewing individual event details (not provided but referenced in `profile.js`).
- **`styles.css`**: Global CSS styles, including variables, modern design components, and responsive layouts.
- **`utils.js`**: Utility functions for managing user preferences, notifications, event filtering, and sidebar functionality.
- **`data.js`**: Data file for events (not provided but referenced in scripts; assumed to contain `eventsData`).
- **`vercel.json`**: Configuration file for Vercel deployment, enabling clean URLs.
- **Assets**:
  - `/logo.png`: Upnext logo used across pages.
  - `/assets/favicon.ico`: Favicon for the website.
  - `/assets/profilepic.png`: Default profile picture for users.

## Setup Instructions
1. **Clone the Repository**:
   - Clone or download the project files to your local machine.
2. **Serve the Website**:
   - Use a local server to host the files (e.g., `npx serve`, or use VS Code's Live Server extension).
   - Alternatively, deploy the website using Vercel (as indicated by `vercel.json`).
3. **Ensure Dependencies**:
   - The project uses Font Awesome for icons, loaded via CDN (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css`).
   - Google Fonts (`Inter` and `Manrope`) are imported in `styles.css` for typography.
   - Ensure an internet connection for loading external resources.
4. **Browser Compatibility**:
   - The website is designed for modern browsers supporting ES6+ JavaScript and CSS custom properties.
5. **Initial Setup**:
   - Open `index.html` in your browser to start using the website.
   - Sign up or log in to access personalized features.

## Dependencies
- **Font Awesome** (v6.0.0-beta3): For icons, loaded via CDN.
- **Google Fonts**: `Inter` and `Manrope` fonts for typography, loaded via `@import` in `styles.css`.
- **Browser Features**:
  - LocalStorage for saving user preferences.
  - Notification API for event reminders.
  - No additional JavaScript libraries or frameworks are required.

## Usage
1. **Sign Up / Log In**:
   - New users can sign up via `signup.html`, providing their full name, school, class, email, and password.
   - Existing users can log in via `login.html` using their email and password.
2. **Navigation**:
   - Use the sidebar (desktop) or bottom navigation (mobile) to access:
     - **Home** (`index.html`): Main landing page.
     - **Explore** (`events.html`): Browse all events.
     - **Flash** (`flash.html`): View flash events.
     - **Profile** (`profile.html`): Manage saved events and user info.
3. **Profile Page**:
   - View saved events and clear them if needed.
   - Log out or access settings via buttons at the top.
4. **Settings Page**:
   - Enable/disable notifications and set notification timing.
   - Export or import user preferences as JSON.
   - Clear all user data.
5. **Event Interaction**:
   - Save events to view them later on the profile page.
   - Receive notifications for saved events based on user preferences.
