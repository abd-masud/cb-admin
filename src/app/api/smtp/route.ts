import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// GET - Retrieve smtp
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        const db = await connectionToDatabase();

        // If user ID is provided, fetch user's smtp
        if (user_id) {
            const [smtp] = await db.query<RowDataPacket[]>(
                `SELECT * FROM smtp WHERE user_id = ?`,
                [user_id]
            );

            if (smtp.length == 0) {
                return NextResponse.json(
                    { success: false, message: "Currency not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: smtp },
                { status: 200 }
            );
        }

        const [smtp] = await db.query<RowDataPacket[]>(
            `SELECT * FROM smtp`
        );

        return NextResponse.json(
            { success: true, data: smtp },
            { status: 200 }
        );
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { user_id, host, port, username, password, encryption, email, company } = await request.json();

        // Validate required fields
        if (!user_id) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if a record exists
        const [existingRecords] = await db.query<RowDataPacket[]>(
            `SELECT * FROM smtp WHERE user_id = ?`,
            [user_id]
        );

        if (existingRecords.length == 0) {
            // Insert new record
            const [result] = await db.query<ResultSetHeader>(
                `INSERT INTO smtp (user_id, host, port, username, password, encryption, email, company) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [user_id, host, port, username, password, encryption, email, company]
            );

            return NextResponse.json(
                {
                    success: true,
                    message: "General settings created",
                    data: { id: result.insertId }
                },
                { status: 201 }
            );
        } else {
            // Update existing record
            const [result] = await db.query<ResultSetHeader>(
                `UPDATE smtp 
                 SET host = ?, port = ?, username = ?, password = ?, encryption = ?, email = ?, company = ? 
                 WHERE user_id = ?`,
                [host, port, username, password, encryption, email, company, user_id]
            );

            return NextResponse.json(
                {
                    success: true,
                    message: "General settings updated",
                    data: { affectedRows: result.affectedRows }
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Error in PUT /api/smtp:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
                error: process.env.NODE_ENV == 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}