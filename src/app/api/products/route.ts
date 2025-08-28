import { connectionToDatabase } from '@/util/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

// POST - Create a new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const products = body.products;

        if (!Array.isArray(products)) {
            return NextResponse.json(
                { success: false, error: 'Expected an array of products' },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();
        const insertValues: any[] = [];

        for (const product of products) {
            const {
                user_id,
                product_id,
                name,
                warehouse,
                warehouse_id,
                cabinet,
                cabinet_id,
                description,
                price,
                buying_price,
                category,
                stock,
                unit,
                type,
                sku,
                supplier,
                attribute
            } = product;

            if (!user_id || !product_id || !name || !warehouse || !warehouse_id || !cabinet || !cabinet_id || !price || !buying_price ||
                !category || stock == null || !unit || !type || !sku) {
                console.error('Missing required fields in product:', product);
                return NextResponse.json(
                    { success: false, error: 'Missing required fields' },
                    { status: 400 }
                );
            }

            const supplierData = supplier
                ? JSON.stringify(supplier)
                : JSON.stringify({});

            const attributeData = Array.isArray(attribute)
                ? JSON.stringify(attribute)
                : JSON.stringify([]);

            const numericPrice = typeof price == 'string' ? parseFloat(price) : price;
            const numericBuyingPrice = typeof buying_price == 'string'
                ? parseFloat(buying_price)
                : buying_price;

            insertValues.push([
                user_id,
                product_id,
                name,
                warehouse,
                warehouse_id,
                cabinet,
                cabinet_id,
                description || '',
                numericPrice,
                numericBuyingPrice,
                category,
                stock,
                unit,
                type,
                sku,
                supplierData,
                attributeData
            ]);
        }

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO products 
             (user_id, product_id, name,  warehouse, warehouse_id,
                cabinet, cabinet_id, description, price, buying_price,
              category, stock, unit, type, sku, supplier, attribute)
             VALUES ${insertValues.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')}`,
            insertValues.flat()
        );

        return NextResponse.json(
            { success: true, message: `${result.affectedRows} product(s) created` },
            { status: 201 }
        );

    } catch (error) {
        console.error('[ERROR in POST /api/products]', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Database operation failed' },
            { status: 500 }
        );
    }
}

// GET - Retrieve product(s)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');
        const db = await connectionToDatabase();

        if (user_id) {
            const [product] = await db.query<RowDataPacket[]>(
                `SELECT * FROM products WHERE user_id = ?`,
                [user_id]
            );

            if (product.length == 0) {
                return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
            }

            return NextResponse.json({ success: true, data: product }, { status: 200 });
        }

        const [products] = await db.query<RowDataPacket[]>(`SELECT * FROM products`);
        return NextResponse.json({ success: true, data: products }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// PUT - Update a product
export async function PUT(request: NextRequest) {
    const db = await connectionToDatabase();
    let connection = null;

    try {
        const rawBody = await request.text();
        let products = JSON.parse(rawBody);

        if (!Array.isArray(products)) {
            products = [products];
        }

        if (products.length == 0) {
            return NextResponse.json(
                { success: false, message: 'No products provided' },
                { status: 400 }
            );
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        for (const product of products) {
            const {
                product_id,
                name,
                supplier,
                description,
                buying_price,
                price,
                category,
                unit,
                attribute,
            } = product;

            const requiredFields = { name, price, category, unit, product_id };
            const missingFields = Object.entries(requiredFields)
                .filter(([value]) => !value)
                .map(([key]) => key);

            if (missingFields.length > 0) {
                await connection.rollback();
                return NextResponse.json(
                    {
                        success: false,
                        message: `Missing required fields for product_id: ${product_id}`,
                        missingFields,
                    },
                    { status: 400 }
                );
            }

            const [existing] = await connection.query<RowDataPacket[]>(
                `SELECT product_id FROM products WHERE product_id = ? FOR UPDATE`,
                [product_id]
            );

            if (existing.length == 0) {
                await connection.rollback();
                return NextResponse.json(
                    { success: false, message: `Product not found: ${product_id}` },
                    { status: 404 }
                );
            }

            const supplierData = supplier ? JSON.stringify(supplier) : null;
            const attributeData = Array.isArray(attribute) ? JSON.stringify(attribute) : null;

            const [result] = await connection.query<ResultSetHeader>(
                `UPDATE products SET
            name = ?,
            supplier = ?,
            description = ?,
            buying_price = ?,
            price = ?,
            category = ?,
            unit = ?,
            attribute = ?
           WHERE product_id = ?`,
                [
                    name.trim(),
                    supplierData,
                    description?.trim() || null,
                    Number(buying_price) || null,
                    Number(price),
                    category.trim(),
                    unit.trim(),
                    attributeData,
                    product_id,
                ]
            );

            if (result.affectedRows < 1) {
                await connection.rollback();
                return NextResponse.json(
                    { success: false, message: `Failed to update product: ${product_id}` },
                    { status: 400 }
                );
            }
        }

        await connection.commit();

        return NextResponse.json(
            { success: true, message: 'Product(s) updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        if (connection) await connection.rollback();

        console.error('Product update error:', error);

        return NextResponse.json(
            { success: false, message: 'Failed to update product(s)' },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// DELETE - Remove products completely
export async function DELETE(request: NextRequest) {
    try {
        const { id, product_id } = await request.json();

        if (!id && !product_id) {
            return NextResponse.json(
                { success: false, message: 'Either id or product_id is required' },
                { status: 400 }
            );
        }

        const db = await connectionToDatabase();

        if (id) {
            // Handle single delete by id
            const [existing] = await db.query<RowDataPacket[]>(
                `SELECT * FROM products WHERE id = ?`,
                [id]
            );

            if (existing.length == 0) {
                return NextResponse.json(
                    { success: false, message: 'Product not found' },
                    { status: 404 }
                );
            }

            const [result] = await db.query<ResultSetHeader>(
                `DELETE FROM products WHERE id = ?`,
                [id]
            );

            return result.affectedRows == 1
                ? NextResponse.json(
                    { success: true, message: 'Product deleted successfully' },
                    { status: 200 }
                )
                : NextResponse.json(
                    { success: false, message: 'Failed to delete product' },
                    { status: 500 }
                );

        } else if (product_id) {
            const productIds = Array.isArray(product_id) ? product_id : [product_id];
            const db = await connectionToDatabase();
            let totalDeleted = 0;

            for (const pid of productIds) {
                const [result] = await db.query<ResultSetHeader>(
                    `DELETE FROM products WHERE product_id = ? LIMIT 1`,
                    [pid]
                );

                totalDeleted += result.affectedRows;
            }

            return totalDeleted > 0
                ? NextResponse.json(
                    { success: true, message: `${totalDeleted} product(s) deleted successfully` },
                    { status: 200 }
                )
                : NextResponse.json(
                    { success: false, message: 'No products found to delete' },
                    { status: 404 }
                );
        }


    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete product'
            },
            { status: 500 }
        );
    }
}
