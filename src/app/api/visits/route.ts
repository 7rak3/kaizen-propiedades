import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/storage';
import { VisitBooking } from '@/types';

export async function GET() {
  const visits = serverStorage.getVisits();
  return NextResponse.json(visits);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newVisit: VisitBooking = {
      ...body,
      id: body.id || `visit-${Date.now()}`,
      status: body.status || 'pendiente',
      createdAt: new Date().toISOString(),
    };

    const created = serverStorage.addVisit(newVisit);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al agendar visita' }, { status: 400 });
  }
}
