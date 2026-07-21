const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { user: req.session.userId ? true : false });
});

router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('login');
});

router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('register');
});

router.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('dashboard');
});

module.exports = router;