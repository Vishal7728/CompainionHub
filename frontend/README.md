# CompanionHub Frontend

This is the frontend application for CompanionHub, built with React.js.

## Features

- User authentication (registration and login)
- User profile management
- Booking creation and management
- Real-time chat with companions
- Responsive design for mobile and desktop

## Tech Stack

- **React.js** - Frontend framework
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API requests
- **Socket.IO** - Real-time communication
- **CSS Modules** - Styling

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
├── src/
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── App.js              # Main App component
│   ├── App.css             # Global styles
│   └── index.js            # Entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs tests
- `npm eject` - Ejects from Create React App

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.