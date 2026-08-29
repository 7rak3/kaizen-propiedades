import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/storage';
import { Lead } from '@/types';

export async function GET() {
  const leads = serverStorage.getLeads();
  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newLead: Lead = {
      ...body,
      id: body.id || `lead-${Date.now()}`,
      stage: body.stage || 'nuevo',
      createdAt: new Date().toISOString(),
      notes: body.notes || [],
    };

    const created = serverStorage.addLead(newLead);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar lead' }, { status: 400 });
  }
}
