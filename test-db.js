import "dotenv/config";
import { Pool } from 'pg';

console.log("Password type:", typeof process.env.DB_PASSWORD);
console.log("Password value exists:", !!process.env.DB_PASSWORD);

const pool = new Pool({
 connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  try {
    console.log("Attempting to connect to PostgreSQL...");
    
    // This runs a simple query to get the current time from the DB server
    const res = await pool.query('SELECT NOW()');
    
    console.log("✅ Connection Successful!");
    console.log("Server Time:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Connection Failed!");
    console.error("Error Message:", err.message);
  } finally {
    // Always close the pool in a script so it doesn't hang
    await pool.end();
  }
}

testConnection();