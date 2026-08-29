'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactoPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          source: 'web_contact',
          message,
          stage: 'nuevo',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-kaizen-gold">
            Atención Personalizada
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-1">
            Contacto & Sedes Kaizen
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Estamos disponibles en nuestras oficinas de Santiago Oriente y Concón Costa, o a través de nuestros canales digitales 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  ¡Mensaje Enviado con Éxito!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Hemos recibido tu consulta. Un corredor de Kaizen Propiedades te responderá a la brevedad.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-kaizen-dark text-white text-xs font-bold hover:bg-slate-800 transition"
                >
                  Enviar Otro Mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                  Escríbenos un Mensaje
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre y apellido"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@correo.cl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ¿En qué podemos ayudarte?
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Cuéntanos si buscas comprar, vender, arrendar o requerir tasación..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-kaizen-gold outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-kaizen-dark text-white font-bold text-sm hover:bg-slate-800 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <span>Enviando...</span> : <span>Enviar Consulta</span>}
                </button>
              </form>
            )}
          </div>

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            {/* Casa Matriz Santiago */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
              <div className="flex items-center gap-2 text-xs font-bold text-kaizen-gold uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>Casa Matriz Santiago (RM)</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Isidora Goyenechea 3000, Piso 18
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Barrio El Golf, Las Condes, Santiago de Chile
              </p>
              <div className="text-xs space-y-1.5 text-slate-700 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+56 2 2987 6543 / +56 9 8456 1234</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lunes a Viernes: 09:00 - 19:00 hrs</span>
                </div>
              </div>
            </div>

            {/* Sede Costa Concón */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>Sede Costa V Región</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Av. Borgoño 25000, Local 4
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Costa de Montemar, Concón, Región de Valparaíso
              </p>
              <div className="text-xs space-y-1.5 text-slate-700 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+56 32 234 5678 / +56 9 9123 7890</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lunes a Sábado: 10:00 - 18:30 hrs</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct */}
            <a
              href="https://wa.me/56984561234?text=Hola%20Kaizen%20Propiedades,%20deseo%20comunicarme%20con%20un%20corredor"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-5 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between transition shadow-md"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <div>
                  <div className="text-sm">Mesa Central WhatsApp 24/7</div>
                  <div className="text-[11px] text-emerald-100 font-normal">Respuesta inmediata</div>
                </div>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Chatear</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
