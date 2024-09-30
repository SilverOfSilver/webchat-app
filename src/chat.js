import React, { useState, useEffect } from 'react';
import axios from 'axios';

const host = window.location.hostname;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch chat messages from the chat server
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://${host}:3001/api/chats`, {
          headers: {
            Authorization: token,
          },
        });
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      }
    };

    fetchMessages();

    // Periodically check for new messages
    const intervalId = setInterval(fetchMessages, 500);
    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username'); // Assume username is stored in localStorage

      await axios.post(
        `http://${host}:3001/api/chats`,
        { ChatText: newMessage, AttachmentsID: null, username }, // Include username
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setNewMessage(''); // Clear input after sending

      // Fetch messages again after sending a new one
      const response = await axios.get(`http://${host}:3001/api/chats`, {
        headers: {
          Authorization: token,
        },
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg) => (
          <div key={msg.ChatId} style={{ marginBottom: '10px' }}>
            <p style={{ margin: 0 }}>
              <strong>{msg.username}</strong>
              <span style={{ opacity: 0.75, marginLeft: '10px', fontSize: '0.9em' }}>
                {new Date(msg.timestamp).toLocaleString()} {/* Format the timestamp */}
              </span>
            </p>
            <p style={{ marginLeft: '20px', marginTop: '5px' }}>{msg.ChatText}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
