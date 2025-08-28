import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// GET - Retrieve generals
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        const db = await connectionToDatabase();

        // If user ID is provided, fetch user's generals
        if (user_id) {
            const [generals] = await db.query<RowDataPacket[]>(
                `SELECT * FROM generals WHERE user_id = ?`,
                [user_id]
            );

            if (generals.length == 0) {
                return NextResponse.json(
                    { success: false, message: "General settings not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: generals },
                { status: 200 }
            );
        }

        const [generals] = await db.query<RowDataPacket[]>(
            `SELECT * FROM generals`
        );

        return NextResponse.json(
            { success: true, data: generals },
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

export async function PUT(request: NextRequest) {
    try {
        const { user_id, department, role, category, size, color, material, weight } = await request.json();

        // Validate required fields
        if (!user_id) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        // Validate arrays exist and are arrays
        const requiredArrays = { department, role, category };
        for (const [key, value] of Object.entries(requiredArrays)) {
            if (!Array.isArray(value)) {
                return NextResponse.json(
                    { success: false, message: `${key} must be an array` },
                    { status: 400 }
                );
            }
        }

        const db = await connectionToDatabase();

        // Check if settings exist for this user
        const [existingSettings] = await db.query<RowDataPacket[]>(
            `SELECT id FROM generals WHERE user_id = ?`,
            [user_id]
        );

        // Prepare data for database
        const dataToStore = {
            department: JSON.stringify(department),
            role: JSON.stringify(role),
            category: JSON.stringify(category),
            size: JSON.stringify(size),
            color: JSON.stringify(color),
            material: JSON.stringify(material),
            weight: JSON.stringify(weight),
        };

        if (existingSettings.length == 0) {
            // Insert new record
            const [result] = await db.query<ResultSetHeader>(
                `INSERT INTO generals (user_id, department, role, category, size, color, material, weight)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [user_id, dataToStore.department, dataToStore.role, dataToStore.category, dataToStore.size, dataToStore.color, dataToStore.material, dataToStore.weight]
            );

            return NextResponse.json(
                {
                    success: true,
                    message: "General settings created",
                    data: { id: result.insertId }
                },
                { status: 201 }
            );
        } else {
            // Update existing record
            const [result] = await db.query<ResultSetHeader>(
                `UPDATE generals 
                 SET department = ?, role = ?, category = ?, size = ?, color = ?, material = ?, weight = ?
                 WHERE user_id = ?`,
                [dataToStore.department, dataToStore.role, dataToStore.category, dataToStore.size, dataToStore.color, dataToStore.material, dataToStore.weight, user_id]
            );

            return NextResponse.json(
                {
                    success: true,
                    message: "General settings updated",
                    data: { affectedRows: result.affectedRows }
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Error in PUT /api/generals:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
                error: process.env.NODE_ENV == 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}