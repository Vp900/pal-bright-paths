const express = require('express');
const { Admission } = require('../models/Admission');
const { auth } = require('../middleware/auth');
const { sendEmail, generateAdminEmailTemplate } = require('../services/email');

const router = express.Router();

// Submit Admission Form
router.post('/submit', async (req, res) => {
    try {
        const {
            studentName, parentName, phone, email, class: admissionClass,
            address, dateOfBirth, gender, previousSchool
        } = req.body;

        // Validation
        if (!studentName || !parentName || !phone || !admissionClass || !address || !dateOfBirth || !gender) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }

        const newAdmission = new Admission({
            studentName, parentName, phone, email, class: admissionClass,
            address, dateOfBirth, gender, previousSchool
        });
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
                'Address': admission.address,
                'Prev School': admission.previousSchool || 'N/A'
            });
            await sendEmail(process.env.ADMIN_EMAIL || "vikaspal90042@gmail.com", "New Admission Application Received", adminHtml);
        } catch (e) {
            console.error("Email send failed:", e);
        }

        res.status(201).json({ success: true, data: admission });
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
