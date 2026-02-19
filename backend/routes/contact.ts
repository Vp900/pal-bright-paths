import express from 'express';
import { Contact } from '../models/Contact';
import { auth, AuthRequest } from '../middleware/auth';
import { sendEmail, generateAdminEmailTemplate } from '../services/email';

const router = express.Router();

// Submit Contact Form
router.post('/submit', async (req, res) => {
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
