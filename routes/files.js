const express = require('express');
const router = express.Router();
const File = require('../models/File');
const fs = require('fs');

router.get('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'وارد سیستم نشده‌اید!' });
    }
    const files = await File.find({ userId: req.session.userId }).sort({ uploadDate: -1 });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطا در دریافت فایلها!' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'فایل ��افت نشد!' });
    }
    if (file.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'دسترسی رد شد!' });
    }
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'خطا!' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'فایل یافت نشد!' });
    }
    if (file.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'دسترسی رد شد!' });
    }
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    await File.deleteOne({ _id: req.params.id });
    res.json({ message: 'فایل حذف شد!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطا در حذف فایل!' });
  }
});

module.exports = router;