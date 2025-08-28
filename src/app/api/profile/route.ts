import path from 'path';
import { writeFile } from 'fs/promises';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';
import { connectionToDatabase } from '@/util/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY as string;
if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in the environment variables.");
}

export async function PUT(request: NextRequest) {
    let db;
    try {
        const data = await request.formData();
        const formDataString = data.get('data');
        const formFields = JSON.parse(formDataString as string);

        const {
            id, name, last_name, contact, company, address
        } = formFields;

        // Process profile image
        const image = data.get('image') as File;
        let imagePost = null;
        if (image && image.size > 0) {
            const imageBytes = await image.arrayBuffer();
            const imageBuffer = Buffer.from(imageBytes);
            const imageFile = image.name;
            await writeFile(path.join(process.cwd(), 'public/uploads/images', imageFile), imageBuffer);
            imagePost = `/api/uploads/images/${imageFile}`;
        }

        // Process company logo
        const logo = data.get('logo') as File;
        let logoPost = null;
        if (logo && logo.size > 0) {
            const logoBytes = await logo.arrayBuffer();
            const logoBuffer = Buffer.from(logoBytes);
            const logoFile = logo.name;
            await writeFile(path.join(process.cwd(), 'public/uploads/logos', logoFile), logoBuffer);
            logoPost = `/api/uploads/logos/${logoFile}`;
        }

        db = await connectionToDatabase();

        // Build the query dynamically
        const setParts = [];
        const params = [];

        setParts.push('name = ?');
        params.push(name);
        setParts.push('last_name = ?');
        params.push(last_name);
        setParts.push('contact = ?');
        params.push(contact);
        setParts.push('company = ?');
        params.push(company);
        setParts.push('address = ?');
        params.push(address);

        if (imagePost) {
            setParts.push('image = ?');
            params.push(imagePost);
        }

        if (logoPost) {
            setParts.push('logo = ?');
            params.push(logoPost);
        }

        const query = `UPDATE user SET ${setParts.join(', ')} WHERE id = ?`;
        params.push(id);

        const [result] = await db.query<ResultSetHeader>(query, params);

        if (result.affectedRows == 1) {
            // Fetch the updated user data to include in the new JWT
            const [updatedUser] = await db.query<RowDataPacket[]>(
                'SELECT * FROM user WHERE id = ?',
                [id]
            );

            if (updatedUser.length == 0) {
                throw new Error('User not found after update');
            }

            const user = updatedUser[0];

            // Generate new JWT token with updated user data
            const token = jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    last_name: user.last_name,
                    email: user.email,
                    contact: user.contact,
                    company: user.company,
                    logo: user.logo,
                    address: user.address,
                    role: user.role,
                    image: user.image
                },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            // Return both success response and new token
            return NextResponse.json({
                success: true,
                message: 'User updated successfully',
                token, // Include the new JWT token
                user: {
                    id: user.id,
                    name: user.name,
                    last_name: user.last_name,
                    email: user.email,
                    contact: user.contact,
                    company: user.company,
                    logo: user.logo,
                    address: user.address,
                    role: user.role,
                    image: user.image
                },
                image: imagePost,
                logo: logoPost
            }, { status: 200 });

        } else {
            throw new Error('Failed to update user - no rows affected');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
    } finally {
        if (db) {
            await db.end();
        }
    }
}