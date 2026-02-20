const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    parentName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false },
    class: { type: String, required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    previousSchool: { type: String, required: false },
    status: { type: String, default: 'pending' }, // pending, approved, rejected
    date: { type: Date, default: Date.now },
});

const Admission = mongoose.model('Admission', admissionSchema);
module.exports = { Admission };
