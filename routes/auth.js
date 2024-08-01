const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

// Connect to MongoDB
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth', {
  serverSelectionTimeoutMS: 5000 // Adjust the timeout as necessary
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});


router.post('/createUser', async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  try {
    await newUser.save();
    res.send('User created');
  } catch (error) {
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

module.exports = router;
