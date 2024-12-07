import pkg from 'pg';
const { Client } = pkg;
import bcrypt from 'bcrypt';

// 使用 Vercel Postgres 连接 URL
const connectionString = 'postgres://default:Jq5eMJkNxpkz@ep-delicate-cherry-a4lm0o5j-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require';

async function addUser() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: true
    },
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');

    // Create the users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    // Hash the password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Insert the user
    const result = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *',
      ['User', 'user@nextmail.com', hashedPassword]
    );

    if (result.rows.length > 0) {
      console.log('User added successfully:', result.rows[0]);
    } else {
      console.log('User already exists');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

addUser();
