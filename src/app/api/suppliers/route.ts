import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// POST - Create a new supplier
export async function POST(request: NextRequest) {
    try {
        const { user_id, supplier_id, company, owner, address, email, contact, products } = await request.json();

        // Basic validation
        if (!user_id || !supplier_id || !company || !owner || !address || !email || !contact) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Insert new supplier
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO suppliers (user_id, supplier_id, company, owner, address, email, contact, products)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, supplier_id, company, owner, address, email, contact, products]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Supplier created successfully',
                    supplierId: result.insertId
                },
                { status: 201 }
            );
        } else {
            throw new Error('Failed to create supplier');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create supplier'
            },
            { status: 500 }
        );
    }
}

// GET - Retrieve suppliers
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        const db = await connectionToDatabase();

        // If supplier ID is provided
        if (user_id) {
            const [suppliers] = await db.query<RowDataPacket[]>(
                `SELECT * FROM suppliers WHERE user_id = ?`,
                [user_id]
            );

            if (suppliers.length == 0) {
                return NextResponse.json(
                    { success: false, message: "Supplier not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: suppliers },
                { status: 200 }
            );
        }

        // If no supplier ID provided, fetch all suppliers
        const [suppliers] = await db.query<RowDataPacket[]>(
            `SELECT * FROM suppliers`
        );

        return NextResponse.json(
            { success: true, data: suppliers },
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

// PUT - Update a supplier
export async function PUT(request: NextRequest) {
    try {
        const { id, supplier_id, company, owner, address, email, contact, products } = await request.json();

        const db = await connectionToDatabase();

        // Check if supplier exists
        const [existingSupplier] = await db.query<RowDataPacket[]>(
            `SELECT * FROM suppliers WHERE id = ?`,
            [id]
        );

        if (existingSupplier.length == 0) {
            return NextResponse.json(
                { success: false, message: "Supplier not found" },
                { status: 404 }
            );
        }

        // Update supplier
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE suppliers 
             SET supplier_id = ?, company = ?, owner = ?, address = ?, email = ?, contact = ?, products = ?
             WHERE id = ?`,
            [supplier_id, company, owner, address, email, contact, products, id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'Supplier updated successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to update supplier');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update supplier'
            },
            { status: 500 }
        );
    }
}

// DELETE - Remove a supplier
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Supplier ID is required" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if supplier exists
        const [existingSupplier] = await db.query<RowDataPacket[]>(
            `SELECT * FROM suppliers WHERE id = ?`,
            [id]
        );

        if (existingSupplier.length == 0) {
            return NextResponse.json(
                { success: false, message: "Supplier not found" },
                { status: 404 }
            );
        }

        // Delete supplier
        const [result] = await db.query<ResultSetHeader>(
            `DELETE FROM suppliers WHERE id = ?`,
            [id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'Supplier deleted successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to delete supplier');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete supplier'
            },
            { status: 500 }
        );
    }
}