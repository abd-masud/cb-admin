import { NextResponse } from "next/server";
import { runQuery } from "@/util/db";
import { hash } from 'bcryptjs';
import { User } from "@/types/context";

export async function POST(req: Request) {
    try {
        // Parse the request body to get the new password and email
        const { newPassword, email } = await req.json();

        // Check if both password and email are provided
        if (!newPassword || !email) {
            return NextResponse.json({ message: "Password fields and email are required" }, { status: 400 });
        }

        // Query to check if the admin exists by email
        const checkEmailQuery = "SELECT * FROM admin WHERE email = ?";
        const emailResults = await runQuery(checkEmailQuery, [email]);

        // If admin not found, return a 404 response
        if ((emailResults as User[]).length == 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Hash the new password before updating it in the database
        const hashedPassword = await hash(newPassword, 10);

        // Query to update the admin's password in the database
        const updatePasswordQuery = "UPDATE admin SET password = ? WHERE email = ?";
        await runQuery(updatePasswordQuery, [hashedPassword, email]);

        // Return success response if password is updated
        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch {
        // Return error response if something goes wrong
        return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 });
    }
}
