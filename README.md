# CompanionHub

A modern companion matching platform built with React.js and Node.js.

## Project Structure

```
companionhub/
├── backend/           # Node.js backend application
│   ├── app.js         # Main server file
│   ├── init.js        # Initialization script
│   ├── package.json   # Backend dependencies
│   ├── README.md      # Backend documentation
│   └── uploads/       # File upload directory
└── frontend/          # React.js frontend application
    ├── package.json   # Frontend dependencies
    ├── README.md      # Frontend documentation
    ├── public/        # Static assets
    │   ├── index.html
    │   ├── manifest.json
    │   └── robots.txt
    └── src/           # Frontend source code
        ├── components/
        ├── pages/
        ├── services/
        ├── App.js
        ├── App.css
        ├── index.js
        └── index.css
```

## Features

- User authentication and profile management
- Companion matching system
- Real-time chat functionality
- Booking system for events and outings
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.IO

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vishal7728/CompainionHub.git
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   # From the backend directory
   npm start
   ```

2. Start the frontend development server:
   ```bash
   # From the frontend directory
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

## Deployment

### Backend Deployment
Deploy the backend to platforms like:
- Heroku
- Render
- Vercel
- Railway

### Frontend Deployment
Deploy the frontend to platforms like:
- GitHub Pages
- Vercel
- Netlify
- Firebase Hosting

## License

This project is licensed under the MIT License.