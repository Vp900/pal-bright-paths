const mongoose = require('mongoose');

const demoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    class: { type: String, required: true },
    preferredDate: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Demo = mongoose.model('Demo', demoSchema);
module.exports = { Demo };
