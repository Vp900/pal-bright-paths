const express = require('express');
const { Admission } = require('../models/Admission');
const { auth } = require('../middleware/auth');
const { sendEmail, generateAdminEmailTemplate } = require('../services/email');

const router = express.Router();

// Submit Admission Form
router.post('/submit', async (req, res) => {
    try {
        const newAdmission = new Admission(req.body);
        const admission = await newAdmission.save();

        // Send email notification
        try {
            const adminHtml = generateAdminEmailTemplate('New Admission Form Submission', {
                'Student Name': admission.studentName,
                'Parent Name': admission.parentName,
                'Phone': admission.phone,
                'Email': admission.email || 'N/A',
                'Class': admission.class,
                'Gender': admission.gender,
                'DOB': admission.dateOfBirth,
                'Address': admission.address
            });
            await sendEmail(process.env.ADMIN_EMAIL || "vikaspal90042@gmail.com", "New Admission Application Received", adminHtml);
        } catch (e) {
            console.error("Email send failed:", e);
        }

        res.status(201).json(admission);
    } catch (err) {
        console.error("Admission submit error:", err.message);
        res.status(500).send('Server Error');
    }
});

// List Admissions (Protected)
router.get('/', auth, async (req, res) => {
    try {
        const admissions = await Admission.find().sort({ date: -1 });
        res.json(admissions);
    } catch (err) {
        console.error("Admission list error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
