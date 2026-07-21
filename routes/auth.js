const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({ error: 'تمام فیلدها الزامی هستند!' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'رمزهای عبور مطابقت ندارند!' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'ایمیل قبلاً ثبت شده است!' });
    }
    user = new User({ username, email, password });
    await user.save();
    req.session.userId = user._id;
    res.status(201).json({ message: 'ثبت نام موفق!', user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطا در ثبت نام!' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'ایمیل و رمز عبور الزامی هستند!' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است!' });
    }
    req.session.userId = user._id;
    res.json({ message: 'ورود موفق!', user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطا در ورود!' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'خطا در خروج!' });
    res.clearCookie('connect.sid');
    res.json({ message: 'خروج موفق!' });
  });
});

router.post('/guest', async (req, res) => {
  try {
    const guestId = uuidv4();
    const user = new User({ isGuest: true, guestId });
    await user.save();
    req.session.userId = user._id;
    req.session.guestId = guestId;
    res.json({ message: 'جلسه مهمان شروع شد!', guestId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطا در ایجاد جلسه مهمان!' });
  }
});

router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'وارد سیستم نشده‌اید!' });
    }
    const user = await User.findById(req.session.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'خطا!' });
  }
});

module.exports = router;