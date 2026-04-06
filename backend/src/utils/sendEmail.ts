import nodemailer from "nodemailer";

type EmailOptions = {
  email: string;
  subject: string;
  otp: string;
};

const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"AI Notes" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px;">
          <h2 style="color: #0066FF; text-align: center;">AI Notes Verification</h2>
          <p>Hello,</p>
          <p>Use the following OTP to complete your process. This code is valid for 10 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #050A18; border: 2px dashed #0066FF; padding: 10px 20px; border-radius: 5px;">
              ${options.otp}
            </span>
          </div>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888; text-align: center;">
            Securely powered by Shivam Kumar Jha
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.verify();
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;