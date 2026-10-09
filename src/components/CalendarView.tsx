import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Plus, 
  Check, 
  X, 
  Bell, 
  Send, 
  CalendarCheck2, 
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Appointment, Contact, AgentUser, ChannelType } from '../types/crm';
import { soundEffects } from '../utils/audio';

interface CalendarViewProps {
  appointments: Appointment[];
  contacts: Contact[];
  agents: AgentUser[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateAppointmentStatus: (id: string, status: 'confirmed' | 'pending' | 'completed' | 'canceled') => void;
  onSendReminderWhatsApp: (appointment: Appointment) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  contacts,
  agents,
  onAddAppointment,
  onUpdateAppointmentStatus,
  onSendReminderWhatsApp,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-15');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<'all' | ChannelType>('all');

  // Form state
  const [contactId, setContactId] = useState(contacts[0]?.id || '');
  const [service, setService] = useState('Demonstração Executiva do CRM');
  const [agentId, setAgentId] = useState(agents[0]?.id || '');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('14:30');
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState('');
  const [channel, setChannel] = useState<ChannelType>('whatsapp');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesAgent = filterAgent === 'all' || apt.agentId === filterAgent;
    const matchesChannel = filterChannel === 'all' || apt.channel === filterChannel;
    return matchesAgent && matchesChannel;
  });

  const appointmentsForSelectedDate = filteredAppointments.filter((a) => a.date === selectedDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = contacts.find((c) => c.id === contactId);
    const agent = agents.find((a) => a.id === agentId);
    if (!contact || !agent) return;

    onAddAppointment({
      contactId: contact.id,
      contactName: contact.name,
      contactPhone: contact.phone,
      channel,
      service,
      agentId: agent.id,
      agentName: agent.name,
      date,
      time,
      durationMinutes: duration,
      status: 'confirmed',
      notes,
      reminderSent: true,
    });

    soundEffects.playSuccessChime();
    setIsModalOpen(false);
  };

  const getChannelBadge = (ch: ChannelType) => {
    switch (ch) {
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <MessageSquare className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
            WhatsApp
          </span>
        );
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-600 dark:text-pink-400">
            <Instagram className="w-3.5 h-3.5" />
            Instagram
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            <Facebook className="w-3.5 h-3.5 fill-blue-600" />
            Facebook
          </span>
        );
    }
  };

  // Dias de exemplo no seletor de calendário semanal
  const calendarDays = [
    { date: '2026-10-14', label: 'Qua, 14 Out', count: appointments.filter(a => a.date === '2026-10-14').length },
    { date: '2026-10-15', label: 'Qui, 15 Out', count: appointments.filter(a => a.date === '2026-10-15').length },
    { date: '2026-10-16', label: 'Sex, 16 Out', count: appointments.filter(a => a.date === '2026-10-16').length },
    { date: '2026-10-17', label: 'Sáb, 17 Out', count: appointments.filter(a => a.date === '2026-10-17').length },
    { date: '2026-10-18', label: 'Dom, 18 Out', count: appointments.filter(a => a.date === '2026-10-18').length },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Topo do Módulo de Agendamentos */}
      <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                Agendamento de Horários
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gerencie consultas, demonstrações e reuniões integradas com lembretes automáticos no WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Agendamento</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Filtrar por Especialista:</span>
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="all">Todos os Especialistas</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Canal:</span>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value as 'all' | ChannelType)}
              className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="all">Todos os Canais</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
        </div>

        {/* Seletor Rápido de Dias */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {calendarDays.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-2 ${
                selectedDate === d.date
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{d.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedDate === d.date
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {d.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Horários e Compromissos */}
      <div className="p-4 md:p-6 max-w-6xl w-full mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Horários Agendados para {selectedDate} ({appointmentsForSelectedDate.length} agendamentos)
          </h2>
        </div>

        {appointmentsForSelectedDate.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CalendarIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              Nenhum agendamento para esta data
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Você pode agendar um novo compromisso e enviar a confirmação instantânea pelo WhatsApp do cliente.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xs"
            >
              + Agendar Horário Agora
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointmentsForSelectedDate.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 transition hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {apt.time}
                      </span>
                      <span className="text-xs text-slate-400">({apt.durationMinutes} min)</span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : apt.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : apt.status === 'completed'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? 'Pendente' : apt.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-3">
                    {apt.service}
                  </h3>

                  <div className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{apt.contactName}</span>
                      <span className="text-slate-400">({apt.contactPhone})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Canal:</span>
                      {getChannelBadge(apt.channel)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Profissional: <strong className="text-slate-700 dark:text-slate-300">{apt.agentName}</strong>
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="mt-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      📝 {apt.notes}
                    </p>
                  )}
                </div>

                {/* Ações do Card */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSendReminderWhatsApp(apt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
                    title="Enviar lembrete oficial pelo WhatsApp"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Lembrete WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {apt.status !== 'completed' && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                        className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        Concluir
                      </button>
                    )}
                    {apt.status !== 'canceled' && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'canceled')}
                        className="px-2 py-1.5 text-xs font-medium rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Novo Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <CalendarCheck2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Novo Agendamento Omnichannel
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Cliente */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cliente / Lead
                </label>
                <select
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.channel.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Canal de Confirmação */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Canal de Notificação & Lembrete
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['whatsapp', 'instagram', 'facebook'] as ChannelType[]).map((ch) => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => setChannel(ch)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                        channel === ch
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {ch === 'whatsapp' && <MessageSquare className="w-3.5 h-3.5" />}
                      {ch === 'instagram' && <Instagram className="w-3.5 h-3.5" />}
                      {ch === 'facebook' && <Facebook className="w-3.5 h-3.5" />}
                      <span className="capitalize">{ch}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Serviço */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Atendimento / Serviço
                </label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Data, Horário e Duração */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duração (min)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min={15}
                    step={15}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Profissional */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Profissional Responsável
                </label>
                <select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notas Internas
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações relevantes para a reunião..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Confirmar & Notificar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
