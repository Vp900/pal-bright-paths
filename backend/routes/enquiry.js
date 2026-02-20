const express = require('express');
const { Enquiry } = require('../models/Enquiry');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Submit Enquiry
router.post("/submit", async (req, res) => {
  try {
    // ✅ Create and save enquiry
    const newEnquiry = new Enquiry(req.body);
    const enquiry = await newEnquiry.save();

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

