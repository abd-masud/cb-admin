import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// POST - Create a new warehouse
export async function POST(request: NextRequest) {
    try {
        const { user_id, warehouse_id, warehouse, address } = await request.json();

        // Basic validation
        if (!user_id || !warehouse_id || !warehouse || !address) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Insert new warehouse
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO warehouse (user_id, warehouse_id, warehouse, address)
             VALUES (?, ?, ?, ?)`,
            [user_id, warehouse_id, warehouse, address]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Warehouse created successfully',
                },
                { status: 201 }
            );
        } else {
            throw new Error('Failed to create warehouse');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create warehouse'
            },
            { status: 500 }
        );
    }
}

// GET - Retrieve warehouses
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        const db = await connectionToDatabase();

        // If warehouse ID is provided
        if (user_id) {
            const [warehouse] = await db.query<RowDataPacket[]>(
                `SELECT * FROM warehouse WHERE user_id = ?`,
                [user_id]
            );

            if (warehouse.length == 0) {
                return NextResponse.json(
                    { success: false, message: "Warehouse not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: warehouse },
                { status: 200 }
            );
        }

        // If no warehouse ID provided, fetch all warehouses
        const [warehouse] = await db.query<RowDataPacket[]>(
            `SELECT * FROM warehouse`
        );

        return NextResponse.json(
            { success: true, data: warehouse },
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

// PUT - Update a warehouse
export async function PUT(request: NextRequest) {
    try {
        const { id, warehouse_id, warehouse, address } = await request.json();

        const db = await connectionToDatabase();

        // Check if warehouse exists
        const [existingWarehouse] = await db.query<RowDataPacket[]>(
            `SELECT * FROM warehouse WHERE id = ?`,
            [id]
        );

        if (existingWarehouse.length == 0) {
            return NextResponse.json(
                { success: false, message: "Warehouse not found" },
                { status: 404 }
            );
        }

        // Update warehouse
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE warehouse
             SET warehouse_id =?, warehouse = ?, address = ?
             WHERE id = ?`,
            [warehouse_id, warehouse, address, id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'warehouse updated successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to update warehouse');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update warehouse'
            },
            { status: 500 }
        );
    }
}

// DELETE - Remove a Warehouse
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Warehouse ID is required" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if warehouse exists
        const [existingWarehouse] = await db.query<RowDataPacket[]>(
            `SELECT * FROM warehouse WHERE id = ?`,
            [id]
        );

        if (existingWarehouse.length == 0) {
            return NextResponse.json(
                { success: false, message: "Warehouse not found" },
                { status: 404 }
            );
        }

        // Delete warehouse
        const [result] = await db.query<ResultSetHeader>(
            `DELETE FROM warehouse WHERE id = ?`,
            [id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'Warehouse deleted successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to delete warehouse');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete warehouse'
            },
            { status: 500 }
        );
    }
}