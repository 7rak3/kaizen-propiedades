import { Property, Agent, Lead, VisitBooking, ValuationRequest, MarketMetrics } from '@/types';
import {
  INITIAL_PROPERTIES,
  INITIAL_AGENTS,
  INITIAL_LEADS,
  INITIAL_VISITS,
  INITIAL_VALUATIONS,
  INITIAL_METRICS,
  CURRENT_UF_CLP,
} from '@/data/mockData';

// Global singleton for server-side persistence during process run
declare global {
  var __kaizen_data: {
    properties: Property[];
    agents: Agent[];
    leads: Lead[];
    visits: VisitBooking[];
    valuations: ValuationRequest[];
    metrics: MarketMetrics;
  } | undefined;
}

function getInitialStore() {
  if (!global.__kaizen_data) {
    global.__kaizen_data = {
      properties: [...INITIAL_PROPERTIES],
      agents: [...INITIAL_AGENTS],
      leads: [...INITIAL_LEADS],
      visits: [...INITIAL_VISITS],
      valuations: [...INITIAL_VALUATIONS],
      metrics: { ...INITIAL_METRICS },
    };
  }
  return global.__kaizen_data;
}

export const serverStorage = {
  getProperties: (): Property[] => {
    return getInitialStore().properties;
  },
  getPropertyBySlug: (slug: string): Property | undefined => {
    return getInitialStore().properties.find((p) => p.slug === slug || p.id === slug);
  },
  getPropertyById: (id: string): Property | undefined => {
    return getInitialStore().properties.find((p) => p.id === id);
  },
  addProperty: (property: Property): Property => {
    const store = getInitialStore();
    store.properties.unshift(property);
    store.metrics.totalProperties = store.properties.length;
    store.metrics.activeListings = store.properties.filter((p) => p.status === 'publicada' || p.status === 'destacada').length;
    store.metrics.totalPortfolioUF = store.properties.reduce((acc, p) => acc + (p.operation === 'venta' ? p.priceUF : 0), 0);
    return property;
  },
  updateProperty: (id: string, updates: Partial<Property>): Property | null => {
    const store = getInitialStore();
    const index = store.properties.findIndex((p) => p.id === id);
    if (index === -1) return null;
    store.properties[index] = {
      ...store.properties[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return store.properties[index];
  },
  deleteProperty: (id: string): boolean => {
    const store = getInitialStore();
    const prevLen = store.properties.length;
    store.properties = store.properties.filter((p) => p.id !== id);
    store.metrics.totalProperties = store.properties.length;
    store.metrics.activeListings = store.properties.filter((p) => p.status === 'publicada' || p.status === 'destacada').length;
    return store.properties.length < prevLen;
  },
  getAgents: (): Agent[] => {
    return getInitialStore().agents;
  },
  getLeads: (): Lead[] => {
    return getInitialStore().leads;
  },
  addLead: (lead: Lead): Lead => {
    const store = getInitialStore();
    store.leads.unshift(lead);
    store.metrics.leadsThisMonth += 1;
    return lead;
  },
  updateLeadStage: (id: string, stage: Lead['stage']): Lead | null => {
    const store = getInitialStore();
    const lead = store.leads.find((l) => l.id === id);
    if (!lead) return null;
    lead.stage = stage;
    return lead;
  },
  getVisits: (): VisitBooking[] => {
    return getInitialStore().visits;
  },
  addVisit: (visit: VisitBooking): VisitBooking => {
    const store = getInitialStore();
    store.visits.unshift(visit);
    store.metrics.visitsThisMonth += 1;
    // Also create a lead entry for this visit booking automatically
    store.leads.unshift({
      id: `lead-visit-${Date.now()}`,
      name: visit.clientName,
      email: visit.clientEmail,
      phone: visit.clientPhone,
      propertyId: visit.propertyId,
      propertyTitle: visit.propertyTitle,
      source: 'visita_agendada',
      message: `Solicitó visita ${visit.visitType} para ${visit.date} a las ${visit.timeSlot}.`,
      stage: 'visita_coordinada',
      notes: [`Visita programada: ${visit.date} ${visit.timeSlot}`],
      createdAt: new Date().toISOString(),
    });
    return visit;
  },
  updateVisitStatus: (id: string, status: VisitBooking['status']): VisitBooking | null => {
    const store = getInitialStore();
    const visit = store.visits.find((v) => v.id === id);
    if (!visit) return null;
    visit.status = status;
    return visit;
  },
  getValuations: (): ValuationRequest[] => {
    return getInitialStore().valuations;
  },
  addValuation: (val: ValuationRequest): ValuationRequest => {
    const store = getInitialStore();
    store.valuations.unshift(val);
    store.leads.unshift({
      id: `lead-val-${Date.now()}`,
      name: val.clientName,
      email: val.clientEmail,
      phone: val.clientPhone,
      source: 'tasacion_express',
      message: `Tasación express solicitada para ${val.propertyType} en ${val.commune}, ${val.surfaceM2}m². Valor est: ${val.estimatedValueUFMin.toLocaleString('es-CL')} - ${val.estimatedValueUFMax.toLocaleString('es-CL')} UF.`,
      preferredRegion: val.region,
      stage: 'nuevo',
      notes: [`Rango tasación: ${val.estimatedValueUFMin}-${val.estimatedValueUFMax} UF`],
      createdAt: new Date().toISOString(),
    });
    return val;
  },
  getMetrics: (): MarketMetrics => {
    return getInitialStore().metrics;
  },
};
