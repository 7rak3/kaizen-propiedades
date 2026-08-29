import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/storage';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (body.status) {
      const updated = serverStorage.updateVisitStatus(id, body.status);
      if (!updated) {
        return NextResponse.json({ error: 'Visita no encontrada' }, { status: 404 });
      }
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'No status provided' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar estado de visita' }, { status: 400 });
  }
}
