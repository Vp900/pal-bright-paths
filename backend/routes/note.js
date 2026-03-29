const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Note } = require('../models/Note');
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
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// @route   GET /api/notes
// @desc    Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/notes/upload
// @desc    Upload a new note
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, className } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const newNote = new Note({
      title,
      className,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
