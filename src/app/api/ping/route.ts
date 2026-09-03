import { NextResponse } from 'next/server';
import { pingDatabase } from '@/lib/db';

export async function GET() {
  const dbStatus = await pingDatabase();
  
  return NextResponse.json({
    message: 'API is alive',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
}
