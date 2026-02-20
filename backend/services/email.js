const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

const generateAdminEmailTemplate = (title, data) => {
    const rows = Object.entries(data).map(([key, value]) => `
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">${key}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${value}</td>
        </tr>
    `).join('');

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">${title}</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background-color: #f4f4f4;">
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Field</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Details</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
                This is an automated notification from your website.
            </p>
        </div>
    `;
};

module.exports = { sendEmail, generateAdminEmailTemplate };

