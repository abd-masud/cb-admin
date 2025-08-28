import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// POST - Create a new invoice
export async function POST(request: NextRequest) {
    try {
        const { user_id, invoice_id, customer, items, date, due_date, subtotal, tax, discount, total, paid_amount, due_amount, pay_type, sub_invoice, notes } = await request.json();

        // Basic validation
        if (!user_id || !invoice_id || !customer || !items) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Insert new invoice
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO invoices (user_id, invoice_id, customer, items, date, due_date, subtotal, tax, discount, total, paid_amount, due_amount, pay_type, sub_invoice, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, invoice_id, JSON.stringify(customer), JSON.stringify(items), date, due_date, subtotal, tax, discount, total, paid_amount, due_amount, pay_type, JSON.stringify(sub_invoice), notes]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Invoice added successfully',
                    invoiceId: result.insertId
                },
                { status: 201 }
            );
        } else {
            throw new Error('Failed to add invoice');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to add invoice'
            },
            { status: 500 }
        );
    }
}

// GET - Retrieve invoices
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        const db = await connectionToDatabase();

        // If user ID is provided, fetch user's invoices
        if (user_id) {
            const [invoices] = await db.query<RowDataPacket[]>(
                `SELECT * FROM invoices WHERE user_id = ?`,
                [user_id]
            );

            if (invoices.length == 0) {
                return NextResponse.json(
                    { success: false, message: "Invoice not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: invoices },
                { status: 200 }
            );
        }

        // If no parameters provided, return all invoices (consider adding pagination)
        const [invoices] = await db.query<RowDataPacket[]>(
            `SELECT * FROM invoices`
        );

        return NextResponse.json(
            { success: true, data: invoices },
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

// PUT - Update an invoice
export async function PUT(request: NextRequest) {
    try {
        const { id, invoice_id, customer, items, date, due_date, subtotal, tax, discount, total, paid_amount, due_amount, pay_type, sub_invoice, notes } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Invoice ID is required" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if invoice exists
        const [existingInvoice] = await db.query<RowDataPacket[]>(
            `SELECT * FROM invoices WHERE id = ?`,
            [id]
        );

        if (existingInvoice.length == 0) {
            return NextResponse.json(
                { success: false, message: "Invoice not found" },
                { status: 404 }
            );
        }

        // Update invoice
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE invoices 
             SET invoice_id = ?, customer = ?, items = ?, date = ?, due_date = ?, 
                 subtotal = ?, tax = ?, discount = ?, total = ?, 
                 paid_amount = ?, due_amount = ?, pay_type = ?, sub_invoice = ?, notes = ?
             WHERE id = ?`,
            [invoice_id, JSON.stringify(customer), JSON.stringify(items), date, due_date,
                subtotal, tax, discount, total, paid_amount, due_amount, pay_type, JSON.stringify(sub_invoice), notes, id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'Invoice updated successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to update invoice');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update invoice'
            },
            { status: 500 }
        );
    }
}

// DELETE - Remove an invoice
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Invoice ID is required" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if invoice exists
        const [existingInvoice] = await db.query<RowDataPacket[]>(
            `SELECT * FROM invoices WHERE id = ?`,
            [id]
        );

        if (existingInvoice.length == 0) {
            return NextResponse.json(
                { success: false, message: "Invoice not found" },
                { status: 404 }
            );
        }

        // Delete invoice
        const [result] = await db.query<ResultSetHeader>(
            `DELETE FROM invoices WHERE id = ?`,
            [id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'Invoice deleted successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to delete invoice');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete invoice'
            },
            { status: 500 }
        );
    }
}