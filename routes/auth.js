const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const SECRET_KEY = 'f25f0a1af07c2c611a78ffa1d8d70af00c08065f8a6f74720d648200e3802a774d93c1690b092b679666390f17a8f32adc6143b594a7ed5007181fec51040fcb'; // Replace this with your generated key

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/auth')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

router.post('/createUser', async (req, res) => {
  console.log('Request Body:', req.body); // Log entire request body for debugging
  const { username, password } = req.body;
  console.log('Received:', { username, password }); // Add this line for debugging
  const newUser = new User({ username, password });
  try {
    await newUser.save();
    res.send('User created');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await user.comparePassword(password)) {
    const token = jwt.sign({ userId: user._id, admin: true }, SECRET_KEY);
    res.setHeader('Authorization', `Bearer ${token}`);
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

router.post('/checkJWT', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.admin) {
      res.send('JWT is valid');
    } else {
      res.status(401).send('JWT is not valid');
    }
  } catch (err) {
    res.status(401).send('JWT is not valid');
  }
});

const authorize = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Exercise 5: Authorization Middleware
router.get('/admin', authorize, (req, res) => {
  res.send('Welcome to the protected admin page.');
});

module.exports = router;
