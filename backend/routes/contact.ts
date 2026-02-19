import express from 'express';
import { Contact } from '../models/Contact';
import { auth } from '../middleware/auth';

const router = express.Router();

// Submit Contact Message
router.post('/submit', async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            subject,
            message,
        });

        const contact = await newContact.save();
        res.json(contact);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// List Contact Messages (Protected)
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ date: -1 });
        res.json(contacts);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
