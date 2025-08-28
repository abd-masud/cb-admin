import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// GET - Retrieve currencies
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        const db = await connectionToDatabase();

        // If user ID is provided, fetch user's currencies
        if (user_id) {
            const [currencies] = await db.query<RowDataPacket[]>(
                `SELECT * FROM currencies WHERE user_id = ?`,
                [user_id]
            );

            if (currencies.length == 0) {
                return NextResponse.json(
                    { success: false, message: "Currency not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: currencies },
                { status: 200 }
            );
        }

        // If no parameters provided, return all currencies (consider adding pagination)
        const [currencies] = await db.query<RowDataPacket[]>(
            `SELECT * FROM currencies`
        );

        return NextResponse.json(
            { success: true, data: currencies },
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
        const { user_id, currency } = await request.json();

        if (!user_id || !currency) {
            return NextResponse.json(
                { success: false, message: "Missing user_id or currency" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if currency already exists for this user
        const [existingCurrency] = await db.query<RowDataPacket[]>(
            `SELECT * FROM currencies WHERE user_id = ?`,
            [user_id]
        );

        if (existingCurrency.length == 0) {
            // Insert new
            const [result] = await db.query<ResultSetHeader>(
                `INSERT INTO currencies (user_id, currency) VALUES (?, ?)`,
                [user_id, currency]
            );

            return NextResponse.json(
                { success: true, message: "Currency created", id: result.insertId },
                { status: 201 }
            );
        } else {
            // Update existing
            const [result] = await db.query<ResultSetHeader>(
                `UPDATE currencies SET currency = ? WHERE user_id = ?`,
                [currency, user_id]
            );

            return NextResponse.json(
                { success: true, message: "Currency updated", affectedRows: result.affectedRows },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
