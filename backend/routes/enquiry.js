const express = require('express');
const { Enquiry } = require('../models/Enquiry');
const { auth } = require('../middleware/auth');
const { sendEmail, generateAdminEmailTemplate } = require('../services/email');

const router = express.Router();

// Submit Enquiry
router.post("/submit", async (req, res) => {
  try {
    // ✅ Create and save enquiry
    const newEnquiry = new Enquiry(req.body);
    const enquiry = await newEnquiry.save();

    // Send email notification
    try {
      const adminHtml = generateAdminEmailTemplate(`New ${enquiry.type === 'demo' ? 'Demo Booking' : 'Enquiry'} Received`, {
        'Type': enquiry.type === 'demo' ? 'Demo Class' : 'General Enquiry',
        'Student Name': enquiry.name,
        'Phone': enquiry.phone,
        'Class': enquiry.class || 'N/A',
        'Message': enquiry.message || 'N/A',
        'Preferred Date': enquiry.preferredDate || 'N/A'
      });
      await sendEmail(process.env.ADMIN_EMAIL || "vikaspal90042@gmail.com", `New ${enquiry.type === 'demo' ? 'Demo' : 'Enquiry'} Request`, adminHtml);
    } catch (e) {
      console.error("Email send failed:", e);
    }

    return res.status(201).json(enquiry);
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

