const { db } = require('@vercel/postgres')
const bcrypt = require('bcrypt')

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `

    console.log(`Created "users" table`)

    // Insert a test user
    const hashedPassword = await bcrypt.hash('123456', 10)
    const insertedUser = await client.sql`
      INSERT INTO users (name, email, password)
      VALUES ('User', 'user@nextmail.com', ${hashedPassword})
      ON CONFLICT (email) DO NOTHING;
    `

    console.log(`Seeded user into the database`)
    return {
      createTable,
      users: insertedUser,
    }
  } catch (error) {
    console.error('Error seeding users:', error)
    throw error
  }
}

async function main() {
  const client = await db.connect()

  await seedUsers(client)

  await client.end()
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err)
})
