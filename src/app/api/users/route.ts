import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// GET - Retrieve users
export async function GET() {
    try {
        const db = await connectionToDatabase();

        // If no user ID provided, fetch all users
        const [users] = await db.query<RowDataPacket[]>(
            `SELECT * FROM user`
        );

        return NextResponse.json(
            { success: true, data: users },
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

// PUT - Update a user
export async function PUT(request: NextRequest) {
    try {
        const { id, status } = await request.json();

        const db = await connectionToDatabase();

        // Check if user exists
        const [existingUser] = await db.query<RowDataPacket[]>(
            `SELECT * FROM user WHERE id = ?`,
            [id]
        );

        if (existingUser.length == 0) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Update user
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE user
             SET status = ?
             WHERE id = ?`,
            [status, id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'User updated successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to update user');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update user'
            },
            { status: 500 }
        );
    }
}

// DELETE - Remove a user
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        // Check if user exists
        const [existingUser] = await db.query<RowDataPacket[]>(
            `SELECT * FROM user WHERE id = ?`,
            [id]
        );

        if (existingUser.length == 0) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Delete user
        const [result] = await db.query<ResultSetHeader>(
            `DELETE FROM user WHERE id = ?`,
            [id]
        );

        if (result.affectedRows == 1) {
            return NextResponse.json(
                { success: true, message: 'User deleted successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete user'
            },
            { status: 500 }
        );
    }
}