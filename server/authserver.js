const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/users.db');
const app = express();
const cors = require('cors');
app.use(cors());

// Use express's built-in body parser for JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Secret for JWT signing
const secret = 'HaxlTheSkeletonKing';

// Route for registering a new user
app.post('/api/register', async (req, res) => {
    console.log("Registration attempt");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (row) {
        console.log("UserExists");
      return res.status(400).json({ error: 'User already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
            console.log("Insertion Error");
          return res.status(500).json({ error: 'Error inserting user' });
        }

        const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
        res.json({ token });
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Login User
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    });
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Logout User (optional)
app.post('/api/logout', (req, res) => {
    // Invalidate the token (usually handled on the client-side)
    res.json({ message: 'Logged out' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}`);
});
