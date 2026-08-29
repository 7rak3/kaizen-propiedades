export type OperationType = 'venta' | 'arriendo' | 'temporal';
export type PropertyType = 'departamento' | 'casa' | 'penthouse' | 'oficina' | 'terreno' | 'parcela';
export type RegionType = 'metropolitana' | 'valparaiso';
export type PropertyStatus = 'publicada' | 'destacada' | 'en_negociacion' | 'vendida' | 'arrendada' | 'borrador';

export interface Property {
  id: string;
  code: string;
  title: string;
  slug: string;
  description: string;
  operation: OperationType;
  propertyType: PropertyType;
  region: RegionType;
  city: string;
  commune: string;
  address: string;
  neighborhood?: string;
  lat: number;
  lng: number;
  priceUF: number;
  priceCLP?: number;
  commonExpensesCLP: number; // Gastos Comunes
  bedrooms: number;
  bathrooms: number;
  parkings: number;
  storageRooms: number;
  usefulSurfaceM2: number;
  totalSurfaceM2: number;
  terraceM2?: number;
  yearBuilt?: number;
  orientation?: string;
  images: string[];
  virtualTourUrl?: string;
  videoUrl?: string;
  features: string[];
  isFeatured: boolean;
  isInvestorOpportunity: boolean;
  estimatedMonthlyRentCLP?: number;
  status: PropertyStatus;
  agentId: string;
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatar: string;
  specialties: string[];
  experienceYears: number;
  bio: string;
  propertiesCount?: number;
}

export type LeadStage = 'nuevo' | 'contactado' | 'visita_coordinada' | 'oferta' | 'en_cierre' | 'ganado' | 'perdido';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  source: 'web_contact' | 'whatsapp' | 'tasacion_express' | 'visita_agendada' | 'personal_shopper';
  message: string;
  budgetUF?: number;
  preferredRegion?: string;
  stage: LeadStage;
  assignedAgentId?: string;
  notes?: string[];
  createdAt: string;
}

export interface VisitBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  timeSlot: string;
  visitType: 'presencial' | 'videollamada';
  status: 'pendiente' | 'confirmada' | 'realizada' | 'cancelada';
  notes?: string;
  createdAt: string;
}

export interface ValuationRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  region: RegionType;
  commune: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  surfaceM2: number;
  condition: 'nueva' | 'excelente' | 'buena' | 'para_remodelar';
  estimatedValueUFMin: number;
  estimatedValueUFMax: number;
  estimatedValueCLP: number;
  status: 'recibida' | 'en_estudio' | 'tasacion_enviada' | 'captada';
  createdAt: string;
}

export interface MarketMetrics {
  ufValue: number;
  usdValue: number;
  totalProperties: number;
  activeListings: number;
  totalPortfolioUF: number;
  leadsThisMonth: number;
  visitsThisMonth: number;
  avgCapRateRM: number;
  avgCapRateValpo: number;
}
