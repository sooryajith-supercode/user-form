import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    // Database connection setup
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Query to find the user by username
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    console.log('Database query result:', rows);  // Log the result to inspect the query

    await connection.end();

    // Check if user exists
    if (rows.length === 0) {
      console.log('User not found');
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const user = rows[0];

    // Compare input password with the hashed password from the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Password mismatch');
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '1h' });

    console.log('Login successful');
    return NextResponse.json({ message: 'Login successful', token }, { status: 200 });

  } catch (error) {
    console.error('Error during login:', error);  // Log the error to inspect what went wrong
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
