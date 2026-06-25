// server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// SMTP Configuration
const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    from_email: process.env.SMTP_FROM_EMAIL,
    from_name: process.env.SMTP_FROM_NAME || 'Muhammad Hasan',
    to_email: process.env.SMTP_TO_EMAIL,
};

// Create transporter
const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465,
    auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
    },
});

// ============================================
// ADD THIS - Test route to check if API is working
// ============================================
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API is running on Vercel!',
        endpoints: {
            'GET /': 'Check API status',
            'POST /send-email': 'Send email'
        }
    });
});

// ============================================
// PREMIUM EMAIL TEMPLATES
// ============================================
function getMainEmailTemplate(data) {
    const { name, email, phone, subject, message } = data;
    const date = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Contact Form Submission</title>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        background: #f0f2f5;
        padding: 40px 20px;
        color: #1a1a1a;
        line-height: 1.6;
    }
    .container {
        max-width: 580px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.08);
    }
    .header {
        background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
        padding: 35px 35px 25px;
        text-align: center;
        position: relative;
    }
    .header .icon { font-size: 42px; display: block; }
    .header h1 {
        color: #ffffff;
        font-size: 24px;
        font-weight: 700;
        margin-top: 6px;
        letter-spacing: -0.5px;
    }
    .header .sub {
        color: rgba(255,255,255,0.8);
        font-size: 13px;
        margin-top: 4px;
    }
    .badge-wrap {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 12px;
        flex-wrap: wrap;
    }
    .badge {
        background: rgba(255,255,255,0.15);
        color: #fff;
        padding: 4px 14px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 500;
    }
    .content { padding: 32px 35px; }
    .greeting h2 {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
    }
    .greeting p {
        color: #666;
        font-size: 14px;
        margin-top: 4px;
    }
    .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin: 20px 0;
    }
    .info-item {
        background: #f8f9fa;
        padding: 14px 16px;
        border-radius: 10px;
    }
    .info-item .label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #999;
        font-weight: 600;
    }
    .info-item .value {
        font-size: 14px;
        color: #1a1a1a;
        margin-top: 2px;
        font-weight: 500;
        word-break: break-word;
    }
    .info-item .value a {
        color: #DC2626;
        text-decoration: none;
    }
    .info-item .value a:hover { text-decoration: underline; }
    .message-box {
        background: #fef2f2;
        border-radius: 12px;
        padding: 20px;
        margin: 16px 0 20px;
        border-left: 4px solid #DC2626;
    }
    .message-box .label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #999;
        font-weight: 600;
    }
    .message-box .value {
        font-size: 14px;
        color: #1a1a1a;
        margin-top: 4px;
        word-break: break-word;
    }
    .actions {
        display: flex;
        gap: 10px;
        margin: 16px 0;
        flex-wrap: wrap;
    }
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        background: #f0f0f0;
        color: #333;
        transition: all 0.2s;
    }
    .btn:hover { background: #e0e0e0; }
    .btn-primary {
        background: #DC2626;
        color: #fff;
    }
    .btn-primary:hover { background: #991B1B; }
    .meta {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 12px 16px;
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 6px;
        font-size: 12px;
        color: #888;
    }
    .footer {
        background: #f8f9fa;
        padding: 20px 35px;
        text-align: center;
        border-top: 1px solid #eee;
    }
    .footer p {
        color: #999;
        font-size: 12px;
        margin: 3px 0;
    }
    .footer .brand {
        color: #DC2626;
        font-weight: 600;
    }
    @media (max-width: 480px) {
        .header { padding: 25px 20px; }
        .content { padding: 24px 20px; }
        .footer { padding: 16px 20px; }
        .info-grid { grid-template-columns: 1fr; }
        .badge-wrap { flex-direction: column; align-items: center; gap: 6px; }
        .actions { flex-direction: column; }
        .meta { flex-direction: column; align-items: center; }
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <span class="icon">📩</span>
        <h1>New Message Received</h1>
        <p class="sub">You have a new inquiry from your portfolio</p>
        <div class="badge-wrap">
            <span class="badge">🕐 ${date}</span>
            <span class="badge">📍 Portfolio Contact</span>
        </div>
    </div>
    <div class="content">
        <div class="greeting">
            <h2>👋 You've Got Mail!</h2>
            <p>Someone reached out through your portfolio contact form. Here are the details:</p>
        </div>
        <div class="info-grid">
            <div class="info-item">
                <div class="label">👤 Name</div>
                <div class="value">${name}</div>
            </div>
            <div class="info-item">
                <div class="label">📧 Email</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="info-item">
                <div class="label">📱 Phone</div>
                <div class="value">${phone !== 'Not provided' ? `<a href="tel:${phone}">${phone}</a>` : 'Not provided'}</div>
            </div>
            <div class="info-item">
                <div class="label">📌 Subject</div>
                <div class="value">${subject}</div>
            </div>
        </div>
        <div class="message-box">
            <div class="label">💬 Message</div>
            <div class="value">${message.replace(/\n/g, '<br>')}</div>
        </div>
        <div class="actions">
            <a href="mailto:${email}?subject=Re: ${subject}" class="btn btn-primary">📧 Reply Now</a>
            ${phone !== 'Not provided' ? `<a href="tel:${phone}" class="btn">📞 Call</a>` : ''}
        </div>
        <div class="meta">
            <span>📥 Submitted: ${date}</span>
            <span>📋 Portfolio Contact</span>
        </div>
    </div>
    <div class="footer">
        <p><span class="brand">✦ Muhammad Hasan</span> &bull; Full Stack Developer</p>
        <p style="font-size: 11px; color: #bbb;">This is an automated notification from your portfolio website</p>
    </div>
</div>
</body>
</html>
    `;
}

function getAutoReplyTemplate(data) {
    const { name, subject } = data;

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thank You for Contacting Me</title>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        background: #f0f2f5;
        padding: 40px 20px;
        color: #1a1a1a;
        line-height: 1.6;
    }
    .container {
        max-width: 500px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.08);
    }
    .header {
        background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
        padding: 35px 30px 25px;
        text-align: center;
    }
    .header .icon { font-size: 48px; display: block; }
    .header h1 {
        color: #ffffff;
        font-size: 22px;
        font-weight: 700;
        margin-top: 4px;
    }
    .header p {
        color: rgba(255,255,255,0.8);
        font-size: 13px;
        margin-top: 2px;
    }
    .content { padding: 30px; }
    .greeting h2 {
        font-size: 18px;
        color: #1a1a1a;
        font-weight: 600;
    }
    .greeting p {
        color: #666;
        font-size: 14px;
        margin-top: 4px;
    }
    .message-box {
        background: #fef2f2;
        border-radius: 12px;
        padding: 16px 20px;
        margin: 16px 0;
        border-left: 4px solid #DC2626;
    }
    .message-box p {
        color: #333;
        font-size: 14px;
        margin: 2px 0;
    }
    .message-box .small {
        font-size: 12px;
        color: #888;
    }
    .divider {
        height: 1px;
        background: #eee;
        margin: 20px 0;
    }
    .signature h3 {
        color: #DC2626;
        font-size: 17px;
        font-weight: 600;
    }
    .signature .title {
        color: #666;
        font-size: 13px;
    }
    .social {
        display: flex;
        gap: 10px;
        margin-top: 10px;
        flex-wrap: wrap;
    }
    .social a {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #666;
        text-decoration: none;
        font-size: 13px;
        padding: 5px 14px;
        border-radius: 20px;
        background: #f0f0f0;
        transition: all 0.2s;
    }
    .social a:hover { background: #e0e0e0; }
    .footer {
        background: #f8f9fa;
        padding: 16px 30px;
        text-align: center;
        border-top: 1px solid #eee;
    }
    .footer p {
        color: #999;
        font-size: 12px;
        margin: 3px 0;
    }
    @media (max-width: 480px) {
        .header { padding: 25px 20px; }
        .content { padding: 20px; }
        .footer { padding: 14px 20px; }
        .social { justify-content: center; }
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <span class="icon">🎉</span>
        <h1>Thank You, ${name}!</h1>
        <p>Your message has been received</p>
    </div>
    <div class="content">
        <div class="greeting">
            <h2>Hey ${name} 👋</h2>
            <p>Thanks for reaching out! I've received your message regarding <strong>${subject}</strong>.</p>
        </div>
        <div class="message-box">
            <p><strong>📌 What happens next?</strong></p>
            <p>I'll review your message and get back to you within <strong>24 hours</strong>.</p>
            <p class="small">In the meantime, feel free to connect with me on social media.</p>
        </div>
        <div class="divider"></div>
        <div class="signature">
            <h3>Muhammad Hasan</h3>
            <p class="title">Full Stack Developer</p>
            <div class="social">
                <a href="https://github.com/MuhammadHasan440">🐙 GitHub</a>
                <a href="https://www.linkedin.com/in/muhammad-hasan-b141b6386">🔗 LinkedIn</a>
                <a href="mailto:hasanwork440@gmail.com">📧 Email</a>
            </div>
        </div>
    </div>
    <div class="footer">
        <p>This is an automated confirmation. Please do not reply.</p>
        <p style="font-size: 11px; color: #ccc;">© ${new Date().getFullYear()} Muhammad Hasan &bull; Portfolio</p>
    </div>
</div>
</body>
</html>
    `;
}

// ============================================
// SEND EMAIL ENDPOINT
// ============================================
app.post('/send-email', async (req, res) => {
    console.log('📨 Received form submission');
    
    try {
        const data = req.body;
        
        // Validate required fields
        const required = ['name', 'email', 'subject', 'message'];
        for (const field of required) {
            if (!data[field] || data[field].trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
                });
            }
        }

        const { name, email, subject, message } = data;
        const phone = data.phone?.trim() || 'Not provided';

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address'
            });
        }

        // Send main email with premium template
        const mainHtml = getMainEmailTemplate({ name, email, phone, subject, message });
        await transporter.sendMail({
            from: `"${smtpConfig.from_name}" <${smtpConfig.from_email}>`,
            to: smtpConfig.to_email,
            subject: `📩 New Contact: ${subject} from ${name}`,
            html: mainHtml,
            replyTo: email,
        });

        console.log('✅ Main email sent');

        // Send auto-reply with premium template
        const autoHtml = getAutoReplyTemplate({ name, subject });
        await transporter.sendMail({
            from: `"${smtpConfig.from_name}" <${smtpConfig.from_email}>`,
            to: email,
            subject: `Thank you for contacting me, ${name}!`,
            html: autoHtml,
        });

        console.log('✅ Auto-reply sent');

        res.json({
            success: true,
            message: 'Message sent successfully! I\'ll get back to you soon.'
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email. Please try again.'
        });
    }
});

// ============================================
// EXPORT FOR VERCEL (ADD THIS)
// ============================================
module.exports = app;

// ============================================
// START SERVER (Local only)
// ============================================
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📧 POST to http://localhost:${PORT}/send-email`);
    });
}