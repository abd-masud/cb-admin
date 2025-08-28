import { NextRequest, NextResponse } from "next/server";
import { connectionToDatabase } from "@/util/db";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // Extract email from the request body
    const { email } = await req.json();

    // Check if the email is provided
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const db = await connectionToDatabase();

    // Check if the admin exists in the database
    const [rows] = await db.query("SELECT * FROM admin WHERE email = ?", [email]);

    // Check if rows is an array and has at least one element
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate a 6-digit OTP and set its expiration time (2 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Store the OTP and expiration in the database
    await db.query("UPDATE admin SET otp = ?, otp_expires_at = ? WHERE email = ?", [
      otpHash,
      otpExpiresAt,
      email,
    ]);

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials not configured");
      return NextResponse.json(
        { message: "Email service not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Set up the email transporter using nodemailer
    const transporter = nodemailer.createTransport({
      host: 'premium900.web-hosting.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log("Server is ready to take our messages");
    } catch (verifyError) {
      console.error("Email server connection failed:", verifyError);
      return NextResponse.json(
        { message: "Email service temporarily unavailable. Please try again later." },
        { status: 500 }
      );
    }

    // Send the OTP email to the admin
    try {
      await transporter.sendMail({
        from: `Copa Business <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
          <h1>Hi, Welcome to Copa Business!</h1>
          <p><b>OTP:</b> Dear User, your OTP code is <b>${otp}</b>. Please do not share this PIN with anyone.
          <br>It is valid for 2 minutes.</p>
          <p>Best Regards,<br>Copa Business</p>
        `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json(
        { message: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    // Return success message after sending OTP
    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    // Log the actual error for debugging
    console.error("Server error in forgot-password:", error);

    // Return error message if something goes wrong
    return NextResponse.json(
      { message: "Error processing your request. Please try again." },
      { status: 500 }
    );
  }
}