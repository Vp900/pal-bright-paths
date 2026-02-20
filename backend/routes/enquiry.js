const express = require('express');
const { Enquiry } = require('../models/Enquiry');
const { auth } = require('../middleware/auth');
const { sendEmail, generateAdminEmailTemplate } = require('../services/email');

const router = express.Router();

// Submit Enquiry
router.post("/submit", async (req, res) => {
  try {
    const { name, phone, class: studentClass, message } = req.body;

    // Validation
    if (!name || !phone || !studentClass) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    // ✅ Create and save enquiry
    const newEnquiry = new Enquiry({ name, phone, class: studentClass, message });
    const enquiry = await newEnquiry.save();

    // Send email notification
    try {
      const adminHtml = generateAdminEmailTemplate(`New General Enquiry Received`, {
        'Type': 'General Enquiry',
        'Student Name': enquiry.name,
        'Phone': enquiry.phone,
        'Class': enquiry.class || 'N/A',
        'Message': enquiry.message || 'N/A'
      });
      await sendEmail(process.env.ADMIN_EMAIL || "vikaspal90042@gmail.com", `New Enquiry Received`, adminHtml);
    } catch (e) {
      console.error("Email send failed:", e);
    }

    return res.status(201).json({ success: true, data: enquiry });
  } catch (err) {
    console.error("Enquiry submit error:", err?.message || err);
    return res.status(500).send("Server Error");
  }
});

// List Enquiries (Protected)
router.get("/", auth, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ date: -1 });
    return res.json(enquiries);
  } catch (err) {
    console.error("Enquiry list error:", err?.message || err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;

