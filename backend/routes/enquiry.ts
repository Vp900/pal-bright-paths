import express from 'express';
import { Enquiry } from '../models/Enquiry';
import { auth, AuthRequest } from '../middleware/auth';
import { sendEmail, generateAdminEmailTemplate } from '../services/email';

const router = express.Router();

// Submit Enquiry
router.post('/submit', async (req, res) => {
});

const enquiry = await newEnquiry.save();
res.json(enquiry);
    } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
});

// List Enquiries (Protected)
router.get('/', auth, async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ date: -1 });
        res.json(enquiries);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
