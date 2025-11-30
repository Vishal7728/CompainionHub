# CompanionHub Backend

The backend API server for the CompanionHub application.

## Features

- User authentication and profile management
- Companion matching system
- Real-time chat functionality
- Booking system for events and outings
- File upload and management
- Email notifications

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.IO for real-time communication
- Stripe for payments
- Cloudinary for media management
- Nodemailer for emails

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/companions` - Get all companions

### Booking System
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get specific booking

### Chat System
- `POST /api/chat` - Create or get existing chat
- `GET /api/chat/:userId` - Get chat with specific user
- `POST /api/chat/messages` - Send a message

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. For development with auto-restart:
   ```bash
   npm run dev
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
PORT=5000
NODE_ENV=development
```

## Database Schema

### User Model
- name (String)
- email (String, unique)
- password (String)
- role (String: 'user' or 'companion')
- bio (String)
- interests (Array of Strings)
- location (String)
- avatar (String)
- isVerified (Boolean)

### Booking Model
- userId (ObjectId, ref: User)
- companionId (ObjectId, ref: User)
- dateTime (Date)
- duration (Number)
- eventType (String)
- status (String: 'pending', 'confirmed', 'completed', 'cancelled')
- notes (String)

### Chat Models
- Chat: participants (Array of ObjectIds), createdAt (Date)
- Message: chatId (ObjectId), senderId (ObjectId), text (String), timestamp (Date)

## License

This project is licensed under the MIT License.