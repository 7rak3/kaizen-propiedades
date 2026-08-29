import { NextResponse } from 'next/server';
import { serverStorage } from '@/lib/storage';

export async function GET() {
  const agents = serverStorage.getAgents();
  return NextResponse.json(agents);
}
