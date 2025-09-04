import mysql from 'mysql2/promise';

let connection;

export const createConnection = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: parseInt(process.env.DB_PORT, 10), // convert to number
        waitForConnections: true,
      });
      console.log('Connected to DB');
    }
  } catch (error) {
    console.error('DB connection error:', error.message);
  }
  return connection;
};
