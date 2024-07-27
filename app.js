const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const sessionRoutes = require('./routes/session');
const jwtRoutes = require('./routes/jwt');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'f25f0a1af07c2c611a78ffa1d8d70af00c08065f8a6f74720d648200e3802a774d93c1690b092b679666390f17a8f32adc6143b594a7ed5007181fec51040fcb', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Ensure secure is false for non-HTTPS connections
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
