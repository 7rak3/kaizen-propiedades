'use client';

import React, { useState } from 'react';
import { Property } from '@/types';
import {
  X,
  Calendar,
  Clock,
  Video,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VisitModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const VisitModal: React.FC<VisitModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [visitType, setVisitType] = useState<'presencial' | 'videollamada'>('presencial');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00 - 12:00');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const timeSlots = [
    '10:00 - 11:00',
    '11:30 - 12:30',
    '15:00 - 16:00',
    '16:30 - 17:30',
    '18:00 - 19:00',
  ];

  // Get tomorrow's date as min
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          propertyImage: property.images[0],
          clientName,
          clientEmail,
          clientPhone,
          date: date || minDate,
          timeSlot,
          visitType,
          notes,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scaleUp relative">
        {/* Header */}
        <div className="bg-kaizen-dark text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs text-kaizen-gold font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Agendamiento Inteligente Kaizen</span>
          </div>
          <h3 className="text-xl font-bold font-serif">Solicitar Visita</h3>
          <p className="text-xs text-slate-300 truncate mt-1">
            {property.title} • {property.commune}
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              ¡Visita Solicitada con Éxito!
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hemos reservado tu horario para el{' '}
              <strong className="text-slate-900">{date || minDate} ({timeSlot})</strong>. Un corredor senior de Kaizen Propiedades se comunicará contigo al <strong>{clientPhone}</strong> para confirmar los detalles.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-kaizen-dark text-white font-semibold hover:bg-slate-800 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Modalidad Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Modalidad de Visita
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisitType('presencial')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                    visitType === 'presencial'
                      ? 'border-kaizen-gold bg-kaizen-gold/10 text-kaizen-dark'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-kaizen-gold" />
                  <span>Presencial en Inmueble</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType('videollamada')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                    visitType === 'videollamada'
                      ? 'border-kaizen-gold bg-kaizen-gold/10 text-kaizen-dark'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-cyan-600" />
                  <span>Tour Videollamada (360°)</span>
                </button>
              </div>
            </div>

            {/* Date and Time Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Fecha Preferida
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-kaizen-gold focus:border-transparent outline-none"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bloque Horario
                </label>
                <div className="relative">
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-kaizen-gold focus:border-transparent outline-none appearance-none bg-white"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ej. Francisca Matte"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="nombre@correo.cl"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comentarios o Requerimientos Especiales (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Deseo consultar por disponibilidad de estacionamientos adicionales o plazos de entrega..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-kaizen-dark text-white font-bold text-sm hover:bg-slate-800 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirmando Reserva...</span>
                  </>
                ) : (
                  <span>Confirmar y Agendar Visita</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
