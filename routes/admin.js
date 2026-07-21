const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Middleware for admin authentication
const adminAuth = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/login');
  }
  next();
};

// Admin Dashboard
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const User = mongoose.model('User');
    const File = mongoose.model('File');
    
    const totalUsers = await User.countDocuments();
    const totalFiles = await File.countDocuments();
    const recentActivity = await File.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');
    
    res.render('admin-dashboard', {
      user: req.session.user,
      stats: {
        totalUsers,
        totalFiles,
        totalStorage: '2.5 GB',
        activeDownloads: 42
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).render('error', { message: 'خطای سرور' });
  }
});

// Get users list (API)
router.get('/api/users', adminAuth, async (req, res) => {
  try {
    const User = mongoose.model('User');
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get files list (API)
router.get('/api/files', adminAuth, async (req, res) => {
  try {
    const File = mongoose.model('File');
    const files = await File.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/api/stats', adminAuth, async (req, res) => {
  try {
    const User = mongoose.model('User');
    const File = mongoose.model('File');
    
    const stats = {
      totalUsers: await User.countDocuments(),
      totalFiles: await File.countDocuments(),
      totalDownloads: 325, // This should be from actual data
      activeUsers: 125 // This should be from actual data
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/api/users/:id', adminAuth, async (req, res) => {
  try {
    const User = mongoose.model('User');
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'کاربر حذف شد' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/api/files/:id', adminAuth, async (req, res) => {
  try {
    const File = mongoose.model('File');
    const file = await File.findByIdAndDelete(req.params.id);
    
    // Delete actual file from storage
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../uploads', file.filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ message: 'فایل حذف شد' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new user
router.post('/api/users', adminAuth, async (req, res) => {
  try {
    const User = mongoose.model('User');
    const { name, email, password } = req.body;
    
    const user = new User({
      name,
      email,
      password,
      role: 'user'
    });
    
    await user.save();
    res.json({ message: 'کاربر اضافه شد', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update system settings
router.post('/api/settings', adminAuth, (req, res) => {
  try {
    const { maxFileSize, speedLimit, sessionTimeout } = req.body;
    
    // Save settings (should be stored in database)
    process.env.MAX_FILE_SIZE = maxFileSize;
    process.env.SPEED_LIMIT = speedLimit;
    process.env.SESSION_TIMEOUT = sessionTimeout;
    
    res.json({ message: 'تنظیمات ذخیره شد' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics data
router.get('/api/analytics', adminAuth, async (req, res) => {
  try {
    const File = mongoose.model('File');
    
    const analytics = {
      weeklyActivity: [45, 52, 48, 65, 72, 58, 68],
      fileTypes: {
        images: 35,
        documents: 25,
        videos: 20,
        music: 12,
        other: 8
      },
      userGrowth: [45, 52, 48, 65, 72, 88]
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;