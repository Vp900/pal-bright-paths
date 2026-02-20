const express = require('express');
const { Contact } = require('../models/Contact');
const { auth } = require('../middleware/auth');
const { sendEmail, generateAdminEmailTemplate } = require('../services/email');

const router = express.Router();

// Submit Contact Form
router.post('/submit', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ msg: 'Name, Email and Message are required' });
        }

        const newContact = new Contact({ name, email, phone, subject, message });
        const contact = await newContact.save();

        // Send email notification
        try {
            const adminHtml = generateAdminEmailTemplate('New Contact Form Submission', {
                Name: contact.name,
                Email: contact.email,
                Phone: contact.phone || 'N/A',
                Subject: contact.subject || 'Website Contact',
                Message: contact.message
            });
            await sendEmail(process.env.ADMIN_EMAIL || "vikaspal90042@gmail.com", "New Contact Received", adminHtml);
        } catch (e) {
            console.error("Email send failed:", e);
        }

        res.status(201).json({ success: true, data: contact });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// List Contact Messages (Protected)
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ date: -1 });
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

