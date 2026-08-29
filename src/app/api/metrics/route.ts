import { NextResponse } from 'next/server';
import { serverStorage } from '@/lib/storage';

export async function GET() {
  const metrics = serverStorage.getMetrics();
  return NextResponse.json(metrics);
}
