# CompanionHub

A modern companion matching platform built with React.js and Node.js.

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
   git clone https://github.com/your-username/companionhub.git
   ```

2. Install backend dependencies:
   ```bash
   cd companionhub
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   # From the root directory
   node app.js
   ```

2. Start the frontend development server:
   ```bash
   # From the frontend directory
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

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

### GitHub Pages Deployment

1. Create a production build of the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the build folder to your preferred hosting platform.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

CompanionHub - A modern companion matching platform