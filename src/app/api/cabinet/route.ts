import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// POST - Create a new cabinet
export async function POST(request: NextRequest) {
    try {
        const { warehouse_id, cabinet_id, cabinet } = await request.json();

        // Basic validation
        if (!warehouse_id || !cabinet_id || !cabinet) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Insert new cabinet
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO cabinet (warehouse_id, cabinet_id, cabinet)
             VALUES (?, ?, ?)`,
            [warehouse_id, cabinet_id, cabinet]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Cabinet created successfully',
                },
                { status: 201 }
            );
        } else {
            throw new Error('Failed to create cabinet');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create cabinet'
            },
            { status: 500 }
        );
    }
}

// GET - Retrieve cabinets
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const warehouse_id = searchParams.get('warehouse_id');
        const db = await connectionToDatabase();

        // If cabinet ID is provided
        if (warehouse_id) {
            const [cabinet] = await db.query<RowDataPacket[]>(
                `SELECT * FROM cabinet WHERE warehouse_id = ?`,
                [warehouse_id]
            );

            if (cabinet.length == 0) {
                return NextResponse.json(
                    { success: false, message: "Cabinet not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: cabinet },
                { status: 200 }
            );
        }

        // If no cabinet ID provided, fetch all cabinets
        const [cabinet] = await db.query<RowDataPacket[]>(
            `SELECT * FROM cabinet`
        );

        return NextResponse.json(
            { success: true, data: cabinet },
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

// PUT - Update a cabinet
export async function PUT(request: NextRequest) {
    try {
        const { id, cabinet_id, cabinet } = await request.json();

        const db = await connectionToDatabase();

        // Check if cabinet exists
        const [existingWarehouse] = await db.query<RowDataPacket[]>(
            `SELECT * FROM cabinet WHERE id = ?`,
            [id]
        );

        if (existingWarehouse.length == 0) {
            return NextResponse.json(
                { success: false, message: "Cabinet not found" },
                { status: 404 }
            );
        }

        // Update warehouse
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE cabinet
             SET cabinet_id =?, cabinet = ?
             WHERE id = ?`,
            [cabinet_id, cabinet, id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'cabinet updated successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to update cabinet');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update cabinet'
            },
            { status: 500 }
        );
    }
}

// DELETE - Remove a cabinet
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Cabinet ID is required" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if cabinet exists
        const [existingCabinet] = await db.query<RowDataPacket[]>(
            `SELECT * FROM cabinet WHERE id = ?`,
            [id]
        );

        if (existingCabinet.length == 0) {
            return NextResponse.json(
                { success: false, message: "cabinet not found" },
                { status: 404 }
            );
        }

        // Delete cabinet
        const [result] = await db.query<ResultSetHeader>(
            `DELETE FROM cabinet WHERE id = ?`,
            [id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'cabinet deleted successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to delete cabinet');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete cabinet'
            },
            { status: 500 }
        );
    }
}