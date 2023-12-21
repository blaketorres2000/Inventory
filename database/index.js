const pgp = require('pg-promise')();

// Connection details for production
const productionConnection = {
    host: 'dpg-ckdcbsesmu8c73822qj0-a',
    port: '5432',
    database: 'cse_340_y45c',
    user: 'cse_340',
    password: '630lyPvUhlFd0hmdIPWjSRo2Or66FuSo',
    // Add other options as needed
  };
  
  // Use the production connection details based on the environment
  const connection = process.env.NODE_ENV === 'development'
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : productionConnection;
// Create a database instance
const db = pgp(connection);

module.exports = db;
