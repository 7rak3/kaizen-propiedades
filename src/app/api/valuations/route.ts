import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/storage';
import { ValuationRequest } from '@/types';
import { CURRENT_UF_CLP } from '@/data/mockData';
import { ufToCLP } from '@/lib/utils';

// Benchmark price in UF/m2 by commune in Chile
const COMMUNE_PRICE_BENCHMARKS_UF_M2: Record<string, { base: number; max: number }> = {
  'Vitacura': { base: 85, max: 120 },
  'Las Condes': { base: 80, max: 110 },
  'Lo Barnechea': { base: 75, max: 105 },
  'Providencia': { base: 65, max: 88 },
  'Ñuñoa': { base: 58, max: 78 },
  'La Reina': { base: 62, max: 82 },
  'Colina / Chicureo': { base: 55, max: 80 },
  'Santiago Centro': { base: 45, max: 62 },
  'Zapallar': { base: 80, max: 130 },
  'Concón': { base: 68, max: 98 },
  'Maitencillo / Puchuncaví': { base: 65, max: 95 },
  'Reñaca': { base: 64, max: 90 },
  'Viña del Mar': { base: 55, max: 80 },
  'Algarrobo': { base: 50, max: 75 },
  'Santo Domingo': { base: 48, max: 72 },
  'Valparaíso': { base: 38, max: 55 },
  'Quilpué': { base: 32, max: 48 },
  'Villa Alemana': { base: 30, max: 45 },
};

export async function GET() {
  const valuations = serverStorage.getValuations();
  return NextResponse.json(valuations);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      region,
      commune,
      propertyType,
      bedrooms,
      bathrooms,
      surfaceM2,
      condition = 'buena',
    } = body;

    const benchmark = COMMUNE_PRICE_BENCHMARKS_UF_M2[commune] || { base: 55, max: 75 };

    // Condition multiplier
    let conditionMultiplier = 1.0;
    if (condition === 'nueva') conditionMultiplier = 1.15;
    else if (condition === 'excelente') conditionMultiplier = 1.08;
    else if (condition === 'para_remodelar') conditionMultiplier = 0.85;

    // Type multiplier
    let typeMultiplier = 1.0;
    if (propertyType === 'penthouse') typeMultiplier = 1.2;
    else if (propertyType === 'casa') typeMultiplier = 0.95; // often larger m2

    const minUFm2 = benchmark.base * conditionMultiplier * typeMultiplier;
    const maxUFm2 = benchmark.max * conditionMultiplier * typeMultiplier;

    const estimatedValueUFMin = Math.round(minUFm2 * (surfaceM2 || 100));
    const estimatedValueUFMax = Math.round(maxUFm2 * (surfaceM2 || 100));
    const estimatedAvgUF = Math.round((estimatedValueUFMin + estimatedValueUFMax) / 2);
    const estimatedValueCLP = ufToCLP(estimatedAvgUF, CURRENT_UF_CLP);

    const newValuation: ValuationRequest = {
      id: `val-${Date.now()}`,
      clientName: clientName || 'Propietario Anónimo',
      clientEmail: clientEmail || '',
      clientPhone: clientPhone || '',
      region: region || 'metropolitana',
      commune: commune || 'Las Condes',
      propertyType: propertyType || 'departamento',
      bedrooms: Number(bedrooms) || 2,
      bathrooms: Number(bathrooms) || 2,
      surfaceM2: Number(surfaceM2) || 100,
      condition,
      estimatedValueUFMin,
      estimatedValueUFMax,
      estimatedValueCLP,
      status: 'recibida',
      createdAt: new Date().toISOString(),
    };

    const created = serverStorage.addValuation(newValuation);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al calcular tasación' }, { status: 400 });
  }
}
