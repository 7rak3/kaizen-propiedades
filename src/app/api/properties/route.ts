import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/storage';
import { Property } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let properties = serverStorage.getProperties();

  const region = searchParams.get('region');
  const operation = searchParams.get('operation');
  const propertyType = searchParams.get('propertyType');
  const commune = searchParams.get('commune');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const bedrooms = searchParams.get('bedrooms');
  const query = searchParams.get('q');
  const featured = searchParams.get('featured');

  if (region) {
    properties = properties.filter((p) => p.region.toLowerCase() === region.toLowerCase());
  }

  if (operation) {
    properties = properties.filter((p) => p.operation.toLowerCase() === operation.toLowerCase());
  }

  if (propertyType) {
    properties = properties.filter((p) => p.propertyType.toLowerCase() === propertyType.toLowerCase());
  }

  if (commune) {
    properties = properties.filter((p) => p.commune.toLowerCase().includes(commune.toLowerCase()));
  }

  if (minPrice) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) properties = properties.filter((p) => p.priceUF >= min);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) properties = properties.filter((p) => p.priceUF <= max);
  }

  if (bedrooms) {
    const beds = parseInt(bedrooms, 10);
    if (!isNaN(beds)) properties = properties.filter((p) => p.bedrooms >= beds);
  }

  if (featured === 'true') {
    properties = properties.filter((p) => p.isFeatured);
  }

  if (query) {
    const q = query.toLowerCase();
    properties = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.commune.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        (p.neighborhood && p.neighborhood.toLowerCase().includes(q)) ||
        p.code.toLowerCase().includes(q)
    );
  }

  return NextResponse.json(properties);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProperty: Property = {
      ...body,
      id: body.id || `prop-${Date.now()}`,
      code: body.code || `KZ-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 0,
    };

    const created = serverStorage.addProperty(newProperty);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear la propiedad' }, { status: 400 });
  }
}
