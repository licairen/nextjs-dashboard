import pkg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

async function checkUsers() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in environment variables');
    return;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true
    },
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');

    // 查询用户表中的所有用户
    const result = await client.query('SELECT * FROM users');
    
    console.log('\nUsers in database:');
    result.rows.forEach(user => {
      console.log('\nUser Details:');
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Password Hash:', user.password);
    });

  } catch (error) {
    console.error('Database query error:', error);
  } finally {
    await client.end();
  }
}

checkUsers();
