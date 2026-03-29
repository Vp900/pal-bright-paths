const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Video } = require('../models/Video');
const { auth } = require('../middleware/auth');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit per video
});

// @route   GET /api/videos
// @desc    Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ date: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/videos/upload
// @desc    Upload a new video
router.post('/upload', auth, upload.single('video'), async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const newVideo = new Video({
      title,
      category,
      videoUrl: `/uploads/${req.file.filename}`
    });

    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/videos/:id
// @desc    Delete a video
router.delete('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
