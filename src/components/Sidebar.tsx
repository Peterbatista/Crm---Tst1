import React from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  UserCog, 
  Share2, 
  LifeBuoy
} from 'lucide-react';

export type TabType = 
  | 'inbox' 
  | 'calendar' 
  | 'contacts' 
  | 'reports' 
  | 'lgpd' 
  | 'team' 
  | 'channels' 
  | 'support';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  unreadCount: number;
  appointmentsTodayCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  unreadCount,
  appointmentsTodayCount,
}) => {
  const navItems = [
    {
      id: 'inbox' as TabType,
      label: 'Atendimentos',
      subtitle: 'WhatsApp, IG, FB',
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : null,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'calendar' as TabType,
      label: 'Agendamentos',
      subtitle: 'Agenda & Horários',
      icon: Calendar,
      badge: appointmentsTodayCount > 0 ? appointmentsTodayCount : null,
      badgeColor: 'bg-teal-600 text-white',
    },
    {
      id: 'contacts' as TabType,
      label: 'Clientes',
      subtitle: 'Base Unificada CRM',
      icon: Users,
    },
    {
      id: 'reports' as TabType,
      label: 'Relatórios & BI',
      subtitle: 'Métricas, CSV e PDF',
      icon: BarChart3,
    },
    {
      id: 'lgpd' as TabType,
      label: 'LGPD & Segurança',
      subtitle: 'Criptografia & Auditoria',
      icon: ShieldCheck,
    },
    {
      id: 'team' as TabType,
      label: 'Equipe & Usuários',
      subtitle: 'Painel Administrativo',
      icon: UserCog,
    },
    {
      id: 'channels' as TabType,
      label: 'Canais & OAuth2',
      subtitle: 'Meta Cloud APIs',
      icon: Share2,
    },
  ];

  return (
    <aside className="w-18 md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all shrink-0">
      {/* Menu principal */}
      <div className="p-3 md:p-4 space-y-1">
        <div className="hidden md:block px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Central Omnichannel
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group relative ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={item.label}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="hidden md:block flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-normal block truncate">
                  {item.subtitle}
                </span>
              </div>

              {/* Indicador de badge em visualização compacta */}
              {item.badge && (
                <span
                  className={`md:hidden absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${item.badgeColor}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer do Menu com Status de Segurança */}
      <div className="p-3 md:p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="hidden md:block p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>PostgreSQL & AES-256</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Dados protegidos e em conformidade estrita com a LGPD.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('support')}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition ${
            currentTab === 'support'
              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <LifeBuoy className="w-5 h-5 text-sky-500" />
          <div className="hidden md:block text-xs">
            <span className="font-semibold block">Ajuda & Suporte 24h</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Atendimento prioritário</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
