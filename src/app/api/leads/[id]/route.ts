import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/storage';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (body.stage) {
      const updated = serverStorage.updateLeadStage(id, body.stage);
      if (!updated) {
        return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
      }
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'No valid update provided' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar lead' }, { status: 400 });
  }
}
