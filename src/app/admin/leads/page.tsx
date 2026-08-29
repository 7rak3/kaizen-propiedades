'use client';

import React, { useState, useEffect } from 'react';
import { Lead, LeadStage } from '@/types';
import {
  Users,
  PlusCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { generateWhatsAppLink, formatUF } from '@/lib/utils';

const STAGES: { id: LeadStage; label: string; color: string }[] = [
  { id: 'nuevo', label: 'Nuevo Lead', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'contactado', label: 'Contactado', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { id: 'visita_coordinada', label: 'Visita Coordinada', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'oferta', label: 'Oferta Presentada', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'en_cierre', label: 'En Cierre Legal', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 'ganado', label: 'Ganado / Cerrado', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);

  // New Lead form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [propertyTitle, setPropertyTitle] = useState('');
  const [budgetUF, setBudgetUF] = useState('');

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) setLeads(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStageChange = async (leadId: string, newStage: LeadStage) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          propertyTitle: propertyTitle || 'Consulta Directa Broker',
          source: 'web_contact',
          message,
          budgetUF: Number(budgetUF) || 0,
          stage: 'nuevo',
        }),
      });
      if (res.ok) {
        setNewLeadModalOpen(false);
        fetchLeads();
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStageIndex = (stage: LeadStage) => STAGES.findIndex((s) => s.id === stage);

  const filteredLeads = leads.filter((l) => {
    if (!search) return true;
    return (
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.propertyTitle && l.propertyTitle.toLowerCase().includes(search.toLowerCase())) ||
      l.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-kaizen-gold">
            CRM Inmobiliario
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
            Pipeline de Leads & Negociaciones ({leads.length})
          </h1>
          <p className="text-xs text-slate-400">
            Seguimiento de prospectos desde la primera consulta hasta el cierre
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar lead por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 outline-none focus:border-kaizen-gold"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={() => setNewLeadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-kaizen-gold text-slate-950 font-bold text-xs hover:bg-kaizen-gold-light transition shadow-gold flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Lead Manual</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-6">
        {STAGES.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.stage === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 min-w-[260px] flex flex-col gap-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {colLeads.length}
                </span>
              </div>

              {/* Lead Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colLeads.map((lead) => {
                  const stageIdx = getStageIndex(lead.stage);
                  const waLink = generateWhatsAppLink(
                    lead.phone,
                    `Hola ${lead.name}, te contacto de Kaizen Propiedades respecto a tu consulta por ${lead.propertyTitle || 'inmueble'}.`
                  );

                  return (
                    <div
                      key={lead.id}
                      className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 shadow-sm space-y-2.5 hover:border-slate-600 transition"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-white text-xs leading-snug">
                          {lead.name}
                        </h4>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-slate-900 text-kaizen-gold font-bold uppercase">
                          {lead.source.replace('_', ' ')}
                        </span>
                      </div>

                      {lead.propertyTitle && (
                        <p className="text-[11px] text-kaizen-gold-light line-clamp-1 font-medium">
                          {lead.propertyTitle}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {lead.message}
                      </p>

                      {lead.budgetUF ? (
                        <div className="text-[10px] text-slate-300 font-mono">
                          Presupuesto: <strong className="text-white">{formatUF(lead.budgetUF)}</strong>
                        </div>
                      ) : null}

                      {/* WhatsApp / Phone Row */}
                      <div className="flex items-center justify-between border-t border-slate-700/60 pt-2 text-[10px]">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Movement Buttons */}
                        <div className="flex items-center gap-1">
                          {stageIdx > 0 && (
                            <button
                              onClick={() => handleStageChange(lead.id, STAGES[stageIdx - 1].id)}
                              className="p-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                              title="Mover a etapa anterior"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {stageIdx < STAGES.length - 1 && (
                            <button
                              onClick={() => handleStageChange(lead.id, STAGES[stageIdx + 1].id)}
                              className="p-1 rounded bg-kaizen-gold text-slate-950 font-bold hover:bg-kaizen-gold-light"
                              title="Avanzar a siguiente etapa"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Lead Modal */}
      {newLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Registrar Lead Manualmente</h3>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="+56 9 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Propiedad de Interés</label>
                <input
                  type="text"
                  placeholder="Ej: Penthouse El Golf o Concón"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notas / Mensaje</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewLeadModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-kaizen-gold text-slate-950 font-bold"
                >
                  Guardar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
