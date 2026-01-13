// server.js
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5001;

// Middleware setup
app.use(cors()); // Allow cross-origin requests from React frontend
app.use(express.json()); // Enable reading JSON data from request body

// Helper: convert ISO datetime to MySQL DATETIME
function toMySQLDatetime(isoString) {
  return isoString
    .replace('T', ' ')
    .replace('Z', '')
    .split('.')[0];
}

// --- MySQL Connection Setup ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, // CHANGE THIS to your MySQL username
    password: process.env.DB_PASSWORD, // CHANGE THIS to your MySQL password
    database: process.env.DB_NAME // Ensure this matches your database name
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// ------------------------------------
// API: Authentication (Username Only)
// ------------------------------------
app.post('/api/login', (req, res) => {
    // In this simplified system, we grant "login" access if a username is provided.
    // WARNING: This is highly insecure and should not be used in a real-world app.
    const { username } = req.body;
    if (!username) {
        return res.status(400).send({ message: 'Username is required' });
    }
    
    // Success response includes the username
    res.send({ 
        success: true, 
        message: 'Login successful', 
        user: { username: username }
    });
});

// ------------------------------------
// API: Todo List (CRUD Operations)
// ------------------------------------

// Get ALL todos (sorted)
app.get('/api/todos', (req, res) => {
  const sql = `
    SELECT *
    FROM todos
    ORDER BY target_datetime DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Get todos by username
app.get('/api/todos/:username', (req, res) => {
  const { username } = req.params;

  const sql = `
    SELECT *
    FROM todos
    WHERE username = ?
    ORDER BY target_datetime DESC
  `;

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Create new todo
app.post('/api/todos', (req, res) => {
  const { username, title, target_datetime } = req.body;

  if (!username || !title || !target_datetime) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const mysqlDatetime = toMySQLDatetime(target_datetime);

  const sql = `
    INSERT INTO todos (username, title, target_datetime, status)
    VALUES (?, ?, ?, 'Todo')
  `;

  db.query(sql, [username, title, mysqlDatetime], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Insert failed' });
    }
    res.json({ message: 'Todo created', id: result.insertId });
  });
});

// Update todo status
app.put('/api/todos/:id', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const allowedStatus = ['Todo', 'Doing', 'Done'];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const sql = `
    UPDATE todos
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Update failed' });
    }
    res.json({ message: 'Status updated' });
  });
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM todos
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Delete failed' });
    }
    res.json({ message: 'Todo deleted' });
  });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});