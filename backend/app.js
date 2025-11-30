const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.locals.io = io;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/companionhub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, unique: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  profileImage: { publicId: String, url: String },
  role: { type: String, enum: ['user', 'companion', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  kyc: {
    aadharNumber: String,
    panNumber: String,
    documents: [{ publicId: String, url: String, type: String }],
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  preferences: {
    languages: [String],
    interests: [String],
    availability: [{ day: String, startTime: String, endTime: String }]
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

const User = mongoose.model('User', userSchema);

// Booking schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companionId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: String, required: true },
  eventName: { type: String, required: true },
  eventType: { type: String, enum: ['travel', 'event', 'outing', 'personal_support'], required: true },
  eventDescription: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
    address: String,
    city: String,
    state: String,
    country: String
  },
  meetingPoint: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  durationHours: { type: Number, required: true },
  pricePerHour: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  commissionPercentage: { type: Number, default: 20 },
  commissionAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  paymentId: { type: String },
  cancellationReason: { type: String },
  cancellationTime: { type: Date },
  notes: { type: String },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    review: { type: String },
    reviewedAt: { type: Date }
  }
}, { timestamps: true });

bookingSchema.index({ userId: 1 });
bookingSchema.index({ companionId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ startDate: 1 });

bookingSchema.pre('save', function(next) {
  if (this.isModified('durationHours') || this.isModified('pricePerHour')) {
    this.totalPrice = this.durationHours * this.pricePerHour;
    this.commissionAmount = (this.totalPrice * this.commissionPercentage) / 100;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

// Payment schema
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'], required: true },
  paymentIntentId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'succeeded', 'failed', 'refunded'], default: 'pending' },
  transactionId: { type: String },
  refundId: { type: String },
  refundedAmount: { type: Number },
  metadata: { type: Map, of: String }
}, { timestamps: true });

paymentSchema.index({ userId: 1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentIntentId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

// Chat schema
const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  content: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  media: { publicId: String, url: String, type: String }
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  messages: [messageSchema],
  lastMessage: {
    content: String,
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }
}, { timestamps: true });

chatSchema.index({ participants: 1 });
chatSchema.index({ bookingId: 1 });

const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);

// Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'companionhub_jwt_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return res.status(404).json({ success: false, message });
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return res.status(400).json({ success: false, message });
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ success: false, message });
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return res.status(401).json({ success: false, message });
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return res.status(401).json({ success: false, message });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Utility functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'companionhub_jwt_secret', {
    expiresIn: '30d'
  });
};

// Auth controller
const register = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, role } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    const userData = {
      name,
      email,
      password,
      role: role || 'user'
    };

    // Only add phone if provided
    if (phone) {
      userData.phone = phone;
    }

    // Only add dateOfBirth if provided
    if (dateOfBirth) {
      userData.dateOfBirth = new Date(dateOfBirth);
    }

    // Only add gender if provided
    if (gender) {
      userData.gender = gender;
    }

    const user = await User.create(userData);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    await user.updateLastActive();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// User controller
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'phone', 'dateOfBirth', 'gender', 'preferences'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid updates'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCompanions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const companions = await User.find({
      role: 'companion',
      isVerified: true,
      isActive: true
    })
    .select('-password')
    .limit(limit)
    .skip(skip)
    .sort({ 'ratings.average': -1, createdAt: -1 });

    const total = await User.countDocuments({
      role: 'companion',
      isVerified: true,
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        companions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Booking controller
const createBooking = async (req, res) => {
  try {
    const {
      companionId,
      eventName,
      eventType,
      eventDescription,
      meetingPoint,
      startDate,
      endDate,
      notes
    } = req.body;

    const companion = await User.findById(companionId);
    
    if (!companion || companion.role !== 'companion' || !companion.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid companion'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const durationHours = (end - start) / (1000 * 60 * 60);
    
    if (durationHours <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid duration'
      });
    }

    const pricePerHour = companion.pricePerHour || 500;

    const booking = await Booking.create({
      userId: req.user._id,
      companionId,
      eventId: uuidv4(),
      eventName,
      eventType,
      eventDescription,
      meetingPoint,
      startDate: start,
      endDate: end,
      durationHours,
      pricePerHour,
      notes
    });

    await booking.populate([
      { path: 'userId', select: 'name email phone' },
      { path: 'companionId', select: 'name email phone profileImage' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = { userId: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate([
        { path: 'userId', select: 'name email phone' },
        { path: 'companionId', select: 'name email phone profileImage' }
      ])
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Chat controller
const createOrGetChat = async (req, res) => {
  try {
    const { participantId, bookingId } = req.body;

    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (booking.userId.toString() !== req.user._id.toString() && 
          booking.companionId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const otherPartyId = booking.userId.toString() === req.user._id.toString() 
        ? booking.companionId.toString() 
        : booking.userId.toString();
        
      if (participantId !== otherPartyId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid participant for this booking'
        });
      }
    }

    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] },
      bookingId: bookingId || null
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, participantId],
        bookingId: bookingId || null
      });
    }

    await chat.populate([
      { path: 'participants', select: 'name email profileImage' }
    ]);

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, content, media } = req.body;

    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId: chat.participants.find(p => p.toString() !== req.user._id.toString()),
      bookingId: chat.bookingId,
      content,
      media
    });

    chat.messages.push(message._id);
    chat.lastMessage = {
      content,
      senderId: req.user._id,
      timestamp: new Date()
    };

    await chat.save();

    await message.populate({ path: 'senderId', select: 'name profileImage' });

    const io = req.app.locals.io;
    if (io) {
      io.to(chatId).emit('receiveMessage', message);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to CompanionHub API',
    version: '1.0.0'
  });
});

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);

app.get('/api/users/profile', authenticate, getProfile);
app.put('/api/users/profile', authenticate, updateProfile);
app.get('/api/users/companions', authenticate, getCompanions);

app.post('/api/bookings', authenticate, createBooking);
app.get('/api/bookings', authenticate, getUserBookings);

app.post('/api/chat', authenticate, createOrGetChat);
app.post('/api/chat/messages', authenticate, sendMessage);

app.use(notFound);
app.use(errorHandler);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });
  
  socket.on('sendMessage', (data) => {
    io.to(data.roomId).emit('receiveMessage', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;