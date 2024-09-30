// chatserver.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const app = express();
const db = new sqlite3.Database('./server/chatdb/textchatdb.db');

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

// Middleware to protect chat routes
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get chat messages
app.get('/api/chats', authenticateToken, (req, res) => {
    db.all('SELECT * FROM Chats ORDER BY Timestamp', (err, chats) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(chats);
    });
});



// Post a new chat message
app.post('/api/chats', authenticateToken, (req, res) => {
    const { ChatText, AttachmentsID } = req.body;
    const userId = req.user.id; // Get user ID from token

    const sql = 'INSERT INTO Chats (UserID, ChatText, Timestamp, AttachmentsID) VALUES (?, ?, ?, ?)';
    db.run(sql, [userId, ChatText, Math.floor(Date.now() / 1000), AttachmentsID], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ ChatId: this.lastID });
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
});
