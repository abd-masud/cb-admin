import { connectionToDatabase } from '@/util/db';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { RowDataPacket } from 'mysql2';

const SECRET_KEY = process.env.SECRET_KEY as string;
if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in the environment variables.");
}

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const requestBody = await request.json();

        // Check if email and password are provided
        if (!requestBody.email || !requestBody.password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const db = await connectionToDatabase();

        // Check if the employee exists in the database
        const [employeeRows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM `employees` WHERE `email` = ?',
            [requestBody.email]
        );

        if (employeeRows.length == 0) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const employee = employeeRows[0];

        // Validate the password
        const isPasswordValid = await compare(requestBody.password, employee.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get user data from users table
        const [userRows] = await db.query<RowDataPacket[]>(
            'SELECT contact, company, logo, address FROM `user` WHERE `id` = ?',
            [employee.user_id]
        );

        if (userRows.length == 0) {
            return new Response(JSON.stringify({ error: 'User data not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userData = userRows[0];

        // Generate JWT token
        const token = jwt.sign(
            {
                id: employee.user_id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                status: employee.status,
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Combine employee data with user data
        const employeeData = {
            id: employee.user_id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            contact: userData.contact,
            company: userData.company,
            logo: userData.logo,
            address: userData.address
        };

        return new Response(
            JSON.stringify({ token, user: employeeData }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Authentication error:', error);
        // Return error if authentication fails
        return new Response(
            JSON.stringify({ error: 'Failed to authenticate employee' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}