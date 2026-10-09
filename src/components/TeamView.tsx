import React, { useState } from 'react';
import { 
  UserCog, 
  Plus, 
  Shield, 
  Mail, 
  Star, 
  CheckCircle2, 
  Clock, 
  X, 
  Edit, 
  Trash2,
  Users
} from 'lucide-react';
import { AgentUser } from '../types/crm';

interface TeamViewProps {
  agents: AgentUser[];
  onAddAgent: (agent: Omit<AgentUser, 'id'>) => void;
  onUpdateAgentStatus: (agentId: string, status: 'online' | 'busy' | 'away' | 'offline') => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  agents,
  onAddAgent,
  onUpdateAgentStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Administrador' | 'Supervisor' | 'Atendente'>('Atendente');
  const [department, setDepartment] = useState<'Vendas' | 'Suporte Técnico' | 'Agendamentos' | 'Geral'>('Vendas');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddAgent({
      name,
      email,
      role,
      department,
      status: 'online',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?w=150&auto=format&fit=crop&q=80`,
      openTickets: 0,
      rating: 5.0,
    });

    setName('');
    setEmail('');
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: AgentUser['status']) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Em Atendimento
          </span>
        );
      case 'away':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Em Pausa
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Offline
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <UserCog className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                Painel de Usuários & Equipe
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gerencie atendentes, supervisores, filas departamentais e permissões de acesso ao sistema.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs md:text-sm transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Atendente</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Resumo da Equipe */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-500">Total de Colaboradores</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{agents.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-500">Atendentes Online</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {agents.filter((a) => a.status === 'online').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-500">Tickets em Atendimento</span>
            <p className="text-2xl font-extrabold text-teal-600 mt-1">
              {agents.reduce((acc, a) => acc + a.openTickets, 0)}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-500">Média Geral de Avaliação</span>
            <p className="text-2xl font-extrabold text-amber-500 mt-1">★ 4.88</p>
          </div>
        </div>

        {/* Grade de Usuários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((ag) => (
            <div
              key={ag.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={ag.avatar}
                      alt={ag.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                        ag.status === 'online'
                          ? 'bg-emerald-500'
                          : ag.status === 'busy'
                          ? 'bg-red-500'
                          : ag.status === 'away'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{ag.name}</h3>
                    <span className="text-xs text-slate-500 block truncate">{ag.email}</span>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {ag.role}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Departamento:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{ag.department}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Atendimentos Ativos:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{ag.openTickets}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Avaliação dos Clientes:</span>
                  <span className="text-amber-500 font-bold">★ {ag.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              {/* Seletor de Status do Atendente */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">Status atual:</span>
                <select
                  value={ag.status}
                  onChange={(e) => onUpdateAgentStatus(ag.id, e.target.value as AgentUser['status'])}
                  className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="online">🟢 Online</option>
                  <option value="busy">🔴 Ocupado</option>
                  <option value="away">🟡 Em Pausa</option>
                  <option value="offline">⚪ Offline</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Adicionar Atendente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Novo Membro da Equipe</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Gabriela Santos"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gabriela.santos@empresa.com.br"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nível de Permissão (Papel)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AgentUser['role'])}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Atendente">Atendente (Acesso a chats e agendamentos)</option>
                  <option value="Supervisor">Supervisor (Monitoramento e relatórios)</option>
                  <option value="Administrador">Administrador (Acesso total)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Departamento</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as AgentUser['department'])}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Vendas">Vendas</option>
                  <option value="Suporte Técnico">Suporte Técnico</option>
                  <option value="Agendamentos">Agendamentos</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Criar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
