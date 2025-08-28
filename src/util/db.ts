import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;
let creatingPoolPromise: Promise<mysql.Pool> | null = null;

async function createNewPool(): Promise<mysql.Pool> {
    return mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
        connectTimeout: 10000,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306
    });
}

export async function connectionToDatabase(): Promise<mysql.Pool> {
    // Reuse healthy pool
    if (pool) {
        try {
            const testConn = await pool.getConnection();
            await testConn.ping();
            testConn.release();
            return pool;
        } catch {
            pool = null; // Discard broken pool
        }
    }

    // If pool is being created, wait for it
    if (!creatingPoolPromise) {
        creatingPoolPromise = createNewPool()
            .then((newPool) => {
                pool = newPool;
                return pool;
            })
            .catch((err) => {
                console.error('Failed to create pool:', err);
                throw new Error('Database connection failed');
            })
            .finally(() => {
                creatingPoolPromise = null;
            });
    }

    return creatingPoolPromise;
}

export async function runQuery(query: string, params: (string | number)[] = []) {
    let connection: mysql.PoolConnection | undefined;

    try {
        const pool = await connectionToDatabase();
        connection = await pool.getConnection();
        const [results] = await connection.query(query, params);
        return results;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    } finally {
        if (connection) {
            try {
                connection.release();
            } catch (releaseError) {
                console.error('Error releasing connection:', releaseError);
            }
        }
    }
}

// Cleanup on process termination
process.on('SIGINT', async () => {
    if (pool) {
        try {
            await pool.end();
            console.log('Connection pool closed');
        } catch (error) {
            console.error('Error closing connection pool:', error);
        }
    }
    process.exit(0);
});
