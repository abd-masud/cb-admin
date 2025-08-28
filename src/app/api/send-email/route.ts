import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { smtpSettings, emailData } = await request.json();

        if (!smtpSettings || !emailData) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: smtpSettings.host,
            port: smtpSettings.port,
            secure: true,
            auth: {
                user: smtpSettings.username,
                pass: smtpSettings.password,
            },
        });

        await transporter.sendMail({
            from: `"${smtpSettings.company}" <${smtpSettings.email}>`,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send email' },
            { status: 500 }
        );
    }
}