import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';  // Import bcrypt for password hashing
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ message: 'Missing username or password' }, { status: 400 });
  }

  try {
    // Create a connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Check if the user already exists
    const [existingUser] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser.length > 0) {
      // User already exists
      return NextResponse.json({ message: 'Username already taken' }, { status: 409 });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); 

    // Insert the user data into the 'users' table
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const values = [username, hashedPassword];  
    await connection.execute(query, values);

    // Close the database connection
    await connection.end();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error saving to database:', error);
    return NextResponse.json({ message: 'Database error, please try again.' }, { status: 500 });
  }
}
