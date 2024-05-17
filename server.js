const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Harish@97',
  database: 'book_database'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('MySQL Connected');
});

// CREATE books 
app.post('/books', (req, res) => {
  const { name, img, summary } = req.body;
  const sql = 'INSERT INTO books (name, img, summary) VALUES (?, ?, ?)';
  db.query(sql, [name, img, summary], (err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(201).send({ id: result.insertId, name, img, summary });
  });
});

// READ all books 
app.get('/books', (req, res) => {
  const sql = 'SELECT * FROM books';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(results);
  });
});

// READ book one by ID
app.get('/books/:id', (req, res) => {
  const sql = 'SELECT * FROM books WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send({ message: 'Book not found' });
    }
    res.send(result[0]);
  });
});

// UPDATE Books by using ID 
app.patch('/books/:id', (req, res) => {
  const { name, img, summary } = req.body;
  const sql = 'UPDATE books SET name = ?, img = ?, summary = ? WHERE id = ?';
  db.query(sql, [name, img, summary, req.params.id], (err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Book not found...!' });
    }
    res.send({ id: req.params.id, name, img, summary });
  });
});

// DELETE the book using ID 
app.delete('/books/:id', (req, res) => {
  const sql = 'DELETE FROM books WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Book not found...!' });
    }
    res.send({ message: 'Book Deleted Successfully !' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
