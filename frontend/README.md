# CompanionHub Frontend

The React.js frontend application for the CompanionHub platform.

## Features

- User authentication (registration and login)
- User profile management
- Booking creation and management
- Real-time chat with companions
- Responsive design for mobile and desktop
- Modern UI with engaging user experience

## Tech Stack

- **React.js** - Frontend framework
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API requests
- **Socket.IO Client** - Real-time communication
- **CSS** - Styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- CompanionHub backend server running

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit `http://localhost:3000`

## Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── index.html          # Main HTML file
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # Search engine instructions
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header.js       # Navigation header
│   │   └── Header.css      # Header styles
│   ├── pages/              # Page components
│   │   ├── Home.js         # Homepage
│   │   ├── Login.js        # Login page
│   │   ├── Register.js     # Registration page
│   │   ├── Dashboard.js    # User dashboard
│   │   ├── Profile.js      # User profile
│   │   ├── Bookings.js     # Bookings management
│   │   ├── CreateBooking.js # Create booking form
│   │   ├── Chat.js         # Chat interface
│   │   └── Auth.css        # Authentication styles
│   ├── services/           # API services
│   │   └── api.js          # Axios instance
│   ├── App.js              # Main App component
│   ├── App.css             # Global styles
│   └── index.js            # Entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs tests
- `npm run eject` - Ejects from Create React App

## API Integration

The frontend connects to the CompanionHub backend API running on `http://localhost:5000`. Make sure the backend server is running before using the frontend.

## Environment Variables

No environment variables are required for the frontend. All configuration is handled through the API endpoints.

## Development Guidelines

- Follow React best practices
- Use functional components with hooks
- Maintain consistent styling
- Write clean, readable code
- Handle errors gracefully

## Deployment

To deploy the frontend to production:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your preferred hosting platform:
   - GitHub Pages
   - Vercel
   - Netlify
   - Firebase Hosting

## License

This project is licensed under the MIT License.