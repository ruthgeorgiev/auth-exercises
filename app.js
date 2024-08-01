require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const sessionRoutes = require('./routes/session');
const jwtRoutes = require('./routes/jwt');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,  
  cookie: { secure: false }  
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the authentication server!');
});

app.use('/session', sessionRoutes);
app.use('/jwt', jwtRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
