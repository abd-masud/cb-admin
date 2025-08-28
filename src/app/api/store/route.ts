import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// POST - Create a new store
export async function POST(request: NextRequest) {
    try {
        const { cabinet_id, store_id, store, address } = await request.json();

        // Basic validation
        if (!cabinet_id || !store_id || !store || !address) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Insert new store
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO store (cabinet_id, store_id, store, address)
             VALUES (?, ?, ?, ?)`,
            [cabinet_id, store_id, store, address]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Store created successfully',
                },
                { status: 201 }
            );
        } else {
            throw new Error('Failed to create store');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create store'
            },
            { status: 500 }
        );
    }
}

// GET - Retrieve stores
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const cabinet_id = searchParams.get('cabinet_id');
        const db = await connectionToDatabase();

        // If store ID is provided
        if (cabinet_id) {
            const [store] = await db.query<RowDataPacket[]>(
                `SELECT * FROM store WHERE cabinet_id = ?`,
                [cabinet_id]
            );

            if (store.length == 0) {
                return NextResponse.json(
                    { success: false, message: "Store not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: store },
                { status: 200 }
            );
        }

        // If no store ID provided, fetch all stores
        const [store] = await db.query<RowDataPacket[]>(
            `SELECT * FROM store`
        );

        return NextResponse.json(
            { success: true, data: store },
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

// PUT - Update a store
export async function PUT(request: NextRequest) {
    try {
        const { id, store_id, store, address } = await request.json();

        const db = await connectionToDatabase();

        // Check if store exists
        const [existingStore] = await db.query<RowDataPacket[]>(
            `SELECT * FROM store WHERE id = ?`,
            [id]
        );

        if (existingStore.length == 0) {
            return NextResponse.json(
                { success: false, message: "Store not found" },
                { status: 404 }
            );
        }

        // Update store
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE store
             SET store_id =?, store = ?, address = ?
             WHERE id = ?`,
            [store_id, store, address, id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'store updated successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to update store');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update store'
            },
            { status: 500 }
        );
    }
}

// DELETE - Remove a Store
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Store ID is required" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if store exists
        const [existingStore] = await db.query<RowDataPacket[]>(
            `SELECT * FROM store WHERE id = ?`,
            [id]
        );

        if (existingStore.length == 0) {
            return NextResponse.json(
                { success: false, message: "Store not found" },
                { status: 404 }
            );
        }

        // Delete store
        const [result] = await db.query<ResultSetHeader>(
            `DELETE FROM store WHERE id = ?`,
            [id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'Store deleted successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to delete store');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete store'
            },
            { status: 500 }
        );
    }
}