import pkg from 'pg';
const { Client } = pkg;

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // 仅用于测试，确保生产环境中正确配置
    },
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await client.end();
  }
}

testConnection();
