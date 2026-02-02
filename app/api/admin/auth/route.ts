import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Default password, should be changed in production

// Simple token generation
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      const token = generateToken();
      return NextResponse.json({ 
        token,
        message: 'Authentication successful' 
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in admin auth:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Verify token from session
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  // In a real app, you'd verify the token against a database or session store
  // For simplicity, we'll just check if token exists (you can enhance this)
  return NextResponse.json({ authenticated: true });
}
