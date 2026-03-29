const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    className: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number },
    date: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', noteSchema);
module.exports = { Note };
