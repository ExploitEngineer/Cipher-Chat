export const resetPasswordEmail = (resetUrl: string, firstName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset | Cipher Chat</title>
  <style>
    /* Reset */
    body, html, * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      line-height: 1.6;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      text-align: center;
    }

    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 10px;
    }

    .header {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 15px;
    }

    .subtext {
      font-size: 15px;
      color: #4b5563;
      margin-bottom: 25px;
    }

    .button {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff !important;
      padding: 14px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      transition: all 0.2s ease-in-out;
    }

    .button:hover {
      background-color: #4338ca;
    }

    .info-text {
      font-size: 14px;
      color: #6b7280;
      margin-top: 20px;
    }

    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
      padding-top: 15px;
    }

    .highlight {
      color: #4f46e5;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Cipher Chat</div>
    <h2 class="header">Hello ${firstName},</h2>
    <p class="subtext">
      We received a request to reset your password for <span class="highlight">Cipher Chat</span>.  
      Click the button below to securely reset your password.
    </p>

    <a href="${resetUrl}" class="button">Reset Password</a>

    <p class="info-text">
      This link will expire in <strong>1 hour</strong>.  
      If you didn’t request a password reset, you can safely ignore this email.
    </p>

    <div class="footer">
      © ${new Date().getFullYear()} Cipher Chat. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
