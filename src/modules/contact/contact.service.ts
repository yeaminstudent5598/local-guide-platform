import nodemailer from "nodemailer";

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const { name, email, subject, message } = data;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Vistara Platform" <${process.env.SMTP_FROM}>`,
    to: process.env.SMTP_FROM,
    replyTo: email,
    subject: `New Inquiry: ${subject} | Vistara Support`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f6f7f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Arial, sans-serif;
    }

    .wrapper {
      padding: 48px 16px;
    }

    .card {
      max-width: 640px;
      margin: auto;
      background: #ffffff;
      border-radius: 22px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
    }

    .header {
      padding: 36px 32px;
      text-align: center;
      background: linear-gradient(135deg, #064e3b, #10b981);
      color: #ffffff;
    }

    .brand {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.6px;
      margin: 0;
    }

    .subtitle {
      margin-top: 6px;
      font-size: 14px;
      opacity: 0.95;
    }

    .content {
      padding: 40px 36px;
      color: #1f2937;
    }

    .block {
      margin-bottom: 32px;
    }

    .label {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.4px;
      color: #6b7280;
      margin-bottom: 6px;
    }

    .value {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
    }

    .info {
      background: #f9fafb;
      border-radius: 16px;
      padding: 22px;
      border: 1px solid #e5e7eb;
    }

    .info-row {
      margin-bottom: 14px;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .message {
      border-radius: 18px;
      padding: 26px;
      background: #ffffff;
      border: 1px dashed #d1d5db;
    }

    .message p {
      margin: 0;
      font-size: 15px;
      line-height: 1.75;
      color: #374151;
      white-space: pre-wrap;
    }

    .cta {
      text-align: center;
      margin-top: 40px;
    }

    .btn {
      display: inline-block;
      padding: 16px 34px;
      border-radius: 999px;
      background: #047857;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 0.3px;
    }

    .footer {
      padding: 22px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      background: #fafafa;
      border-top: 1px solid #e5e7eb;
    }

    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 32px 0;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="card">

      <div class="header">
        <h1 class="brand">Vistara<span style="color:#d1fae5;">.</span></h1>
        <div class="subtitle">You’ve received a new contact message</div>
      </div>

      <div class="content">

        <div class="block info">
          <div class="info-row">
            <div class="label">From</div>
            <div class="value">${name}</div>
          </div>

          <div class="info-row">
            <div class="label">Email</div>
            <div class="value">${email}</div>
          </div>

          <div class="info-row">
            <div class="label">Subject</div>
            <div class="value">${subject}</div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="block">
          <div class="label">Message</div>
          <div class="message">
            <p>${message}</p>
          </div>
        </div>

        <div class="cta">
          <a href="mailto:${email}" class="btn">Reply to Message</a>
        </div>

      </div>

      <div class="footer">
        This email was generated from the Vistara contact form.<br />
        © ${new Date().getFullYear()} Vistara Platform
      </div>

    </div>
  </div>
</body>
</html>
`,
  };

  return await transporter.sendMail(mailOptions);
};