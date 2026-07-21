const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../models/File');
const fs = require('fs');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'application/zip', 'application/x-rar-compressed'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('نوع فایل مجاز نیست!'));
    }
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'فایلی انتخاب نشده!' });
    }
    if (!req.session.userId) {
      return res.status(401).json({ error: 'وارد سیستم نشده‌اید!' });
    }
    const downloadUrl = `/download/${req.file.filename}`;
    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      downloadUrl,
      userId: req.session.userId,
      guestId: req.session.guestId,
      uploadedBy: req.session.guestId ? 'guest' : 'user'
    });
    await newFile.save();
    res.status(201).json({
      message: 'فایل با موفقیت آپلود شد!',
      file: {
        id: newFile._id,
        filename: newFile.originalName,
        size: newFile.size,
        uploadDate: newFile.uploadDate,
        downloadUrl: newFile.downloadUrl
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'خطا در آپلود فایل!' });
  }
});

router.get('/download/:filename', async (req, res) => {
  try {
    const file = await File.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ error: 'فایل یافت نشد!' });
    }
    file.downloads += 1;
    await file.save();
    res.download(file.path, file.originalName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطا در دانلود فایل!' });
  }
});

module.exports = router;