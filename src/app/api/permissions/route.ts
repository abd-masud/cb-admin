import { connectionToDatabase } from '@/util/db';
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// GET - Retrieve permissions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        const db = await connectionToDatabase();

        const [permissions] = await db.query<RowDataPacket[]>(
            `SELECT * FROM permissions WHERE user_id = ?`,
            [user_id]
        );

        if (permissions.length == 0) {
            return NextResponse.json(
                { success: true, data: [] },
                { status: 200 }
            );
        }

        // Get the permissions data
        const permissionsData = permissions[0].permissions;

        // Check if it's already an object
        let parsedPermissions;
        if (typeof permissionsData == 'string') {
            try {
                parsedPermissions = JSON.parse(permissionsData);
            } catch (parseError) {
                console.error('Failed to parse permissions:', parseError);
                parsedPermissions = permissionsData; // fallback to raw data
            }
        } else {
            // If it's not a string, use it directly
            parsedPermissions = permissionsData;
        }

        return NextResponse.json(
            { success: true, data: parsedPermissions },
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
        const permissionsData = await request.json();
        const user_id = request.headers.get('user_id');

        if (!user_id) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        const db = await connectionToDatabase();

        // Validate the data structure
        if (!Array.isArray(permissionsData)) {
            return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
        }

        const [existingSettings] = await db.query<RowDataPacket[]>(
            `SELECT * FROM permissions WHERE user_id = ?`,
            [user_id]
        );

        if (existingSettings.length == 0) {
            await db.query(
                `INSERT INTO permissions (user_id, permissions) VALUES (?, ?)`,
                [user_id, JSON.stringify(permissionsData)]
            );
        } else {
            await db.query(
                `UPDATE permissions SET permissions = ? WHERE user_id = ?`,
                [JSON.stringify(permissionsData), user_id]
            );
        }

        return NextResponse.json(
            { success: true, message: "Permissions updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in PUT /api/permissions:', error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}