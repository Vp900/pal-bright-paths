const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    message: { type: String, required: false },
    class: { type: String, required: false },
    preferredDate: { type: String, required: false },
    type: { type: String, default: 'general' }, // general, demo
    date: { type: Date, default: Date.now },
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);
module.exports = { Enquiry };

