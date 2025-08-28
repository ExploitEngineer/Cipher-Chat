export const resetPasswordEmail = (resetUrl: string, firstName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f7;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 15px rgba(0,0,0,0.1);
    }
    .button {
      display: inline-block;
      background-color: #4f46e5;
      color: #fff;
      padding: 12px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hello ${firstName},</h2>
    <p>You requested a password reset for your account.</p>
    <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p class="footer">If you did not request this, please ignore this email.</p>
  </div>
</body>
</html>
`;
