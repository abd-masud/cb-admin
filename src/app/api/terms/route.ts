import { connectionToDatabase } from '@/util/db';
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// GET - Retrieve terms record(s)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        const db = await connectionToDatabase();

        if (!user_id) {
            return NextResponse.json({
                success: false,
                message: 'User ID is required'
            }, { status: 400 });
        }

        const [records] = await db.query<RowDataPacket[]>(
            `SELECT * FROM terms WHERE user_id = ?`,
            [user_id]
        );

        if (records.length == 0) {
            return NextResponse.json({
                success: false,
                data: { terms: [] }
            }, { status: 404 });
        }

        const record = records[0];
        let terms = [];

        try {
            terms = typeof record.terms == 'string'
                ? JSON.parse(record.terms)
                : record.terms || [];
        } catch (e) {
            console.error('Error parsing terms:', e);
            terms = [];
        }

        return NextResponse.json({
            success: true,
            data: { terms }
        }, { status: 200 });

    } catch (error) {
        console.error('Error in GET /api/terms:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// PUT - Update a terms record
export async function PUT(request: NextRequest) {
    try {
        const { terms } = await request.json();
        const user_id = request.headers.get('user_id');

        if (!user_id) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        const db = await connectionToDatabase();

        // Check if a record exists
        const [existingRecords] = await db.query<RowDataPacket[]>(
            `SELECT * FROM terms WHERE user_id = ?`,
            [user_id]
        );

        if (existingRecords.length > 0) {
            // Update existing record
            await db.query(
                `UPDATE terms SET terms = ? WHERE user_id = ?`,
                [JSON.stringify(terms), user_id]
            );
            return NextResponse.json({ success: true, message: 'Terms updated' }, { status: 200 });
        } else {
            // Insert new record
            await db.query(
                `INSERT INTO terms (user_id, terms) VALUES (?, ?)`,
                [user_id, JSON.stringify(terms)]
            );
            return NextResponse.json({ success: true, message: 'Terms created' }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Server error'
        }, { status: 500 });
    }
}