const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || 'your_super_secret_key';

router.get('/login', (req, res) => {
  res.send('<form method="POST" action="/jwt/connect"><input type="text" name="login" placeholder="login"/><input type="password" name="password" placeholder="password"/><button type="submit">Login</button></form>');
});

router.post('/connect', (req, res) => {
  const { login, password } = req.body;
  if (login === 'john' && password === 'doe') {
    // Correctly create a JWT with an expiration time
    const token = jwt.sign({ admin: true }, SECRET_KEY, { expiresIn: '1h' });
    res.setHeader('Authorization', `Bearer ${token}`);
    res.send('<form method="POST" action="/jwt/checkJWT"><input type="text" name="token" placeholder="token"/><button type="submit">Check Token</button></form>');
  } else {
    res.redirect('/jwt/login');
  }
});

router.post('/checkJWT', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.admin) {
      res.redirect('/jwt/admin');
    } else {
      res.redirect('/jwt/login');
    }
  } catch (err) {
    res.redirect('/jwt/login');
  }
});

router.get('/admin', (req, res) => {
  res.send('Welcome to the JWT admin page.');
});

module.exports = router;
