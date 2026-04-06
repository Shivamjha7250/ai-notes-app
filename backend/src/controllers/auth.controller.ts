import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Context } from "hono";
import { generateOTP } from "../utils/otp.js";
import sendEmail from "../utils/sendEmail.js";

/* ================= REGISTER ================= */
export const register = async (c: Context) => {
  try {
    const { email, password, name } = await c.req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json({ message: "User already exists" }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false,
      },
    });

    await sendEmail({ email, subject: "Verify your account", otp });

    return c.json({ message: "OTP sent to email" }, 201);
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
};

/* ================= VERIFY REGISTER ================= */
export const verifyRegister = async (c: Context) => {
  try {
    const { email, otp } = await c.req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp) {
      return c.json({ message: "Invalid OTP" }, 400);
    }

    if (user.otpExpires! < new Date()) {
      return c.json({ message: "OTP expired" }, 400);
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null,
      },
    });

    return c.json({ message: "Registration successful" });
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
};

/* ================= LOGIN ================= */
export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return c.json({ message: "User not found" }, 404);
    if (!user.isVerified)
      return c.json({ message: "Verify account first" }, 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return c.json({ message: "Invalid credentials" }, 400);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpires },
    });

    await sendEmail({ email, subject: "Login OTP", otp });

    return c.json({ message: "OTP sent" });
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
};

/* ================= VERIFY LOGIN ================= */
export const verifyLogin = async (c: Context) => {
  try {
    const { email, otp } = await c.req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp)
      return c.json({ message: "Invalid OTP" }, 400);

    if (user.otpExpires! < new Date())
      return c.json({ message: "OTP expired" }, 400);

    await prisma.user.update({
      where: { email },
      data: { otp: null, otpExpires: null },
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return c.json({ token });
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (c: Context) => {
  try {
    const { email } = await c.req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return c.json({ message: "User not found" }, 404);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpires },
    });

    await sendEmail({ email, subject: "Reset OTP", otp });

    return c.json({ message: "OTP sent" });
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (c: Context) => {
  try {
    const { email, otp, newPassword } = await c.req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp)
      return c.json({ message: "Invalid OTP" }, 400);

    if (user.otpExpires! < new Date())
      return c.json({ message: "OTP expired" }, 400);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpires: null,
      },
    });

    return c.json({ message: "Password reset successful" });
  } catch (err: any) {
    return c.json({ message: err.message }, 500);
  }
};