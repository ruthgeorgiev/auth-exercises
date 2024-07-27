const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/auth', {
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
}).then(() => {
  console.log('Connected to MongoDB');
  mongoose.connection.close();
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
