import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// POST - Create a new quote
export async function POST(request: NextRequest) {
    try {
        const { user_id, quote_id, customer, items, date, subtotal, tax, discount, total, notes } = await request.json();

        // Basic validation
        if (!user_id || !quote_id || !customer || !items) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Insert new quote
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO quotes (user_id, quote_id, customer, items, date, subtotal, tax, discount, total, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, quote_id, JSON.stringify(customer), JSON.stringify(items), date, subtotal, tax, discount, total, notes]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Quote added successfully',
                    quoteId: result.insertId
                },
                { status: 201 }
            );
        } else {
            throw new Error('Failed to add quote');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to add quote'
            },
            { status: 500 }
        );
    }
}

// GET - Retrieve quotes
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        const db = await connectionToDatabase();

        // If user ID is provided, fetch user's quotes
        if (user_id) {
            const [quotes] = await db.query<RowDataPacket[]>(
                `SELECT * FROM quotes WHERE user_id = ?`,
                [user_id]
            );

            if (quotes.length == 0) {
                return NextResponse.json(
                    { success: false, message: "Quote not found" },
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

// PUT - Update an quote
export async function PUT(request: NextRequest) {
    try {
        const { id, quote_id, customer, items, date, subtotal, tax, discount, total, notes } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Quote ID is required" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if quote exists
        const [existingQuote] = await db.query<RowDataPacket[]>(
            `SELECT * FROM quotes WHERE id = ?`,
            [id]
        );

        if (existingQuote.length == 0) {
            return NextResponse.json(
                { success: false, message: "Quote not found" },
                { status: 404 }
            );
        }

        // Update quote
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE quotes 
             SET quote_id = ?, customer = ?, items = ?, date = ?,
                 subtotal = ?, tax = ?, discount = ?, total = ?, 
                 notes = ?
             WHERE id = ?`,
            [quote_id, JSON.stringify(customer), JSON.stringify(items), date,
                subtotal, tax, discount, total, notes, id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'Quote updated successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to update quote');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update quote'
            },
            { status: 500 }
        );
    }
}

// DELETE - Remove an quote
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Quote ID is required" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if quote exists
        const [existingQuote] = await db.query<RowDataPacket[]>(
            `SELECT * FROM quotes WHERE id = ?`,
            [id]
        );

        if (existingQuote.length == 0) {
            return NextResponse.json(
                { success: false, message: "Quote not found" },
                { status: 404 }
            );
        }

        // Delete quote
        const [result] = await db.query<ResultSetHeader>(
            `DELETE FROM quotes WHERE id = ?`,
            [id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'Quote deleted successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to delete quote');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete quote'
            },
            { status: 500 }
        );
    }
}