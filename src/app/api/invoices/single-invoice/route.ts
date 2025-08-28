import { NextRequest, NextResponse } from 'next/server';
import { connectionToDatabase } from '@/util/db';
import { RowDataPacket } from 'mysql2';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const invoiceId = searchParams.get('id');
        const db = await connectionToDatabase();

        if (!invoiceId) {
            return NextResponse.json(
                { success: false, message: 'Invoice ID is required in headers' },
                { status: 400 }
            );
        }

        const [invoices] = await db.query<RowDataPacket[]>(
            `SELECT * FROM invoices WHERE id = ?`,
            [invoiceId]
        );

        if (invoices.length == 0) {
            return NextResponse.json(
                { success: false, message: 'Invoice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: invoices[0] },
            { status: 200 }
        );
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
