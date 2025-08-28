import { NextResponse } from "next/server";
import { connectionToDatabase } from "@/util/db";
import crypto from "crypto";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    // Extract OTP and email from the request body
    const { otp, email } = await req.json();

    // Validate the required fields
    if (!otp || !email) {
      return NextResponse.json({ message: "OTP and email are required" }, { status: 400 });
    }

    // Connect to the database
    const db = await connectionToDatabase();

    // Query the database for the OTP and its expiration time
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT otp FROM admin WHERE email = ? AND otp_expires_at > NOW()",
      [email]
    );

    // Check if the OTP exists and is not expired
    if (!Array.isArray(rows) || rows.length == 0) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    // Hash the input OTP and compare it with the stored OTP hash
    const storedOtpHash = rows[0].otp as string;
    const inputOtpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // If the OTPs do not match, return an error
    if (storedOtpHash !== inputOtpHash) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Clear the OTP and expiration time in the database after successful verification
    await db.query("UPDATE admin SET otp = NULL, otp_expires_at = NULL WHERE email = ?", [email]);

    // Return a success response
    return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
  } catch {
    // Handle unexpected errors
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
