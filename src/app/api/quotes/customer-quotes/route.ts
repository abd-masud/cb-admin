import { connectionToDatabase } from '@/util/db';
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// GET - Retrieve quotes
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const customer_id = searchParams.get('id');
        const db = await connectionToDatabase();

        // If customer ID is provided, fetch quotes for that customer
        if (customer_id) {
            const [quotes] = await db.query<RowDataPacket[]>(
                `SELECT * FROM quotes WHERE JSON_EXTRACT(customer, '$.id') = ?`,
                [Number(customer_id)]
            );

            if (quotes.length == 0) {
                return NextResponse.json(
                    { success: false, message: "No quotes found for this customer" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: quotes },
                { status: 200 }
            );
        }

        // If no parameters provided, return all quotes (consider adding pagination)
        const [quotes] = await db.query<RowDataPacket[]>(
            `SELECT * FROM quotes`
        );

        return NextResponse.json(
            { success: true, data: quotes },
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