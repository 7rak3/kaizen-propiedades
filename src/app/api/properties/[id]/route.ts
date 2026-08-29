import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const property = serverStorage.getPropertyBySlug(id) || serverStorage.getPropertyById(id);

  if (!property) {
    return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
  }

  return NextResponse.json(property);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const updated = serverStorage.updateProperty(id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar propiedad' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const deleted = serverStorage.deleteProperty(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Propiedad eliminada correctamente' });
}
