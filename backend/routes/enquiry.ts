import express, { Request, Response } from "express";
import { Enquiry } from "../models/Enquiry";
import { auth } from "../middleware/auth";
// import { sendEmail, generateAdminEmailTemplate } from "../services/email"; // agar use ho raha hai to uncomment

const router = express.Router();

// Submit Enquiry
router.post("/submit", async (req: Request, res: Response) => {
  try {
    // ✅ Create and save enquiry
    const newEnquiry = new Enquiry(req.body);
    const enquiry = await newEnquiry.save();

    // ✅ OPTIONAL: email send (agar aapka service ready hai)
    // try {
    //   const adminHtml = generateAdminEmailTemplate(enquiry);
    //   await sendEmail({
    //     to: process.env.ADMIN_EMAIL || "admin@example.com",
    //     subject: "New Enquiry Received",
    //     html: adminHtml,
    //   });
    // } catch (e) {
    //   console.error("Email send failed:", e);
    // }

    return res.status(201).json(enquiry);
  } catch (err: any) {
    console.error("Enquiry submit error:", err?.message || err);
    return res.status(500).send("Server Error");
  }
});

// List Enquiries (Protected)
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const enquiries = await Enquiry.find().sort({ date: -1 });
    return res.json(enquiries);
  } catch (err: any) {
    console.error("Enquiry list error:", err?.message || err);
    return res.status(500).send("Server Error");
  }
});

export default router;
