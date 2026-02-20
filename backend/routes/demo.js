const express = require('express');
const { Demo } = require('../models/Demo');
const { auth } = require('../middleware/auth');
const { sendEmail, generateAdminEmailTemplate } = require('../services/email');

const router = express.Router();

// Submit Demo Booking
router.post('/submit', async (req, res) => {
    try {
        const { name, phone, class: studentClass, preferredDate } = req.body;

        // Validation
        if (!name || !phone || !studentClass || !preferredDate) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }

        const newDemo = new Demo({ name, phone, class: studentClass, preferredDate });
        const demo = await newDemo.save();

        // Send email notification
        try {
            const adminHtml = generateAdminEmailTemplate('New Demo Class Booking', {
                'Student Name': demo.name,
                'Phone': demo.phone,
                'Class': demo.class,
                'Preferred Date': demo.preferredDate
            });
            await sendEmail(process.env.ADMIN_EMAIL || "vikaspal90042@gmail.com", "New Demo Booking Received", adminHtml);
        } catch (e) {
            console.error("Email send failed:", e);
        }

        res.status(201).json({ success: true, data: demo });
    } catch (err) {
        console.error("Demo submit error:", err.message);
        res.status(500).send('Server Error');
    }
});

// List Demo Bookings (Protected)
router.get('/', auth, async (req, res) => {
    try {
        const demos = await Demo.find().sort({ date: -1 });
        res.json(demos);
    } catch (err) {
        console.error("Demo list error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
