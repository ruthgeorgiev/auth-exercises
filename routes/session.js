const express = require('express');
const router = express.Router();

router.get('/setname', (req, res) => {
  const name = req.query.name;
  if (name) {
    req.session.name = name;
    res.send(`Name has been set to ${name}`);
  } else {
    res.send('Please provide a name.');
  }
});

router.get('/getname', (req, res) => {
  if (req.session.name) {
    res.send(`Name in session is ${req.session.name}`);
  } else {
    res.send('No name set in session.');
  }
});

router.get('/login', (req, res) => {
  res.send('<form method="POST" action="/session/connect"><input type="text" name="login" placeholder="login"/><input type="password" name="password" placeholder="password"/><button type="submit">Login</button></form>');
});

router.post('/connect', (req, res) => {
  const { login, password } = req.body;
  console.log(`Login: ${login}, Password: ${password}`);
  if (login === 'john' && password === 'doe') {
    req.session.isConnected = true;
    console.log('Authentication successful, redirecting to /session/admin');
    res.redirect('/session/admin');
  } else {
    console.log('Authentication failed, redirecting to /session/login');
    res.redirect('/session/login');
  }
});

router.get('/admin', (req, res) => {
  if (req.session.isConnected) {
    res.send('Welcome to the admin page.');
  } else {
    res.redirect('/session/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/session/admin');
    }
    res.clearCookie('connect.sid');
    res.redirect('/session/login');
  });
});

module.exports = router;
