import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import './Chat.css';

let socket;

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Fetch user contacts/bookings
        const res = await api.get('/bookings');
        const bookings = res.data.bookings || [];
        
        // Extract unique contacts from bookings
        const uniqueContacts = bookings.reduce((acc, booking) => {
          const companion = booking.companionId;
          if (companion && !acc.find(c => c._id === companion._id)) {
            acc.push({
              _id: companion._id,
              name: companion.name,
              avatar: companion.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(companion.name)}&background=random`,
              lastMessage: 'Say hello to your new companion!',
              unread: 0
            });
          }
          return acc;
        }, []);
        
        setContacts(uniqueContacts);
        
        // Initialize socket connection
        socket = io('http://localhost:5000');
        
        socket.on('connect', () => {
          console.log('Connected to chat server');
        });
        
        socket.on('receiveMessage', (message) => {
          setMessages(prev => [...prev, message]);
        });
        
      } catch (err) {
        console.error('Error initializing chat:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const selectContact = (contact) => {
    setCurrentContact(contact);
    // Load chat history for this contact
    setMessages([
      {
        _id: '1',
        sender: contact._id,
        text: `Hi! I'm ${contact.name}. Looking forward to our time together!`,
        timestamp: new Date()
      }
    ]);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !currentContact) return;

    const message = {
      _id: Date.now().toString(),
      sender: 'me',
      text: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Emit message to socket server
    if (socket) {
      socket.emit('sendMessage', {
        receiverId: currentContact._id,
        text: newMessage
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return <div className="chat-loading">Loading chat...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>Messages</h2>
          <div className="online-indicator">● Online</div>
        </div>
        
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search contacts..." 
            className="search-input"
          />
        </div>
        
        <div className="contacts-list">
          {contacts.length === 0 ? (
            <div className="no-contacts">
              <p>No contacts yet</p>
              <p className="hint">Book a companion to start chatting</p>
            </div>
          ) : (
            contacts.map(contact => (
              <div 
                key={contact._id} 
                className={`contact-item ${currentContact?._id === contact._id ? 'active' : ''}`}
                onClick={() => selectContact(contact)}
              >
                <img src={contact.avatar} alt={contact.name} />
                <div className="contact-info">
                  <h4>{contact.name}</h4>
                  <p className="last-message">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <div className="unread-badge">{contact.unread}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="chat-main">
        {currentContact ? (
          <>
            <div className="chat-header-main">
              <div className="contact-details">
                <img src={currentContact.avatar} alt={currentContact.name} />
                <div>
                  <h3>{currentContact.name}</h3>
                  <p className="status">Online - Last seen recently</p>
                </div>
              </div>
            </div>
            
            <div className="messages-container">
              {messages.map(message => (
                <div 
                  key={message._id} 
                  className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}
                >
                  {message.sender !== 'me' && (
                    <img src={currentContact.avatar} alt={currentContact.name} className="avatar" />
                  )}
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="timestamp">
                      {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="message-input-container">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="message-input"
                rows="1"
              />
              <button 
                onClick={sendMessage}
                className="send-button"
                disabled={!newMessage.trim()}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="chat-welcome">
            <div className="welcome-content">
              <h2>Welcome to CompanionHub Chat</h2>
              <p>Select a contact to start messaging</p>
              <div className="chat-illustration">
                💬
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;