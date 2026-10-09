import React from 'react';
import { 
  Radio, 
  Smartphone, 
  Monitor, 
  Moon, 
  Sun, 
  Sparkles, 
  LifeBuoy, 
  PlusCircle, 
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { AgentUser } from '../types/crm';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  viewMode: 'desktop' | 'android';
  setViewMode: (val: 'desktop' | 'android') => void;
  onOpenAccessibility: () => void;
  onOpenSupport: () => void;
  onSimulateIncomingMessage: () => void;
  activeAgent: AgentUser;
  webSocketStatus: 'connected' | 'reconnecting';
  unreadTotal: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  viewMode,
  setViewMode,
  onOpenAccessibility,
  onOpenSupport,
  onSimulateIncomingMessage,
  activeAgent,
  webSocketStatus,
  unreadTotal,
}) => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between transition-colors z-20 shrink-0">
      {/* Esquerda: Logo e Conexão */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/20">
            <span>Ω</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 dark:text-white">
                OmniFlow <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs md:text-sm">CRM</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                <Lock className="w-3 h-3" />
                LGPD E2EE
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${webSocketStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {webSocketStatus === 'connected' ? 'WebSocket Ativo (14ms)' : 'Reconectando...'}
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="hidden md:inline">Meta APIs v21.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Centro: Ações rápidas */}
      <div className="hidden lg:flex items-center gap-2">
        <button
          type="button"
          onClick={onSimulateIncomingMessage}
          title="Simular cliente enviando mensagem em tempo real pelo WhatsApp, Instagram ou Facebook"
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Simular Mensagem de Cliente</span>
        </button>

        {/* Alternador de Plataforma: Web vs Android */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition ${
              viewMode === 'desktop'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Web Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('android')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition ${
              viewMode === 'android'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Android (Mobile)</span>
          </button>
        </div>
      </div>

      {/* Direita: Acessibilidade, Modo Escuro, Suporte 24h e Perfil */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Botão de Simulação em Telas Menores */}
        <button
          type="button"
          onClick={onSimulateIncomingMessage}
          className="lg:hidden p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl"
          title="Simular Mensagem"
        >
          <PlusCircle className="w-5 h-5" />
        </button>

        {/* Suporte Técnico 24h */}
        <button
          type="button"
          onClick={onOpenSupport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Suporte Técnico 24h OmniFlow"
        >
          <LifeBuoy className="w-4 h-4 text-sky-500" />
          <span className="hidden sm:inline">Suporte 24h</span>
        </button>

        {/* Acessibilidade WCAG */}
        <button
          type="button"
          onClick={onOpenAccessibility}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Opções de Acessibilidade (Voz, Legendas, Alto Contraste)"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Acessibilidade</span>
        </button>

        {/* Modo Noturno */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          aria-label={darkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Noturno'}
          title={darkMode ? 'Modo Claro' : 'Modo Noturno'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Perfil do Atendente */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="relative">
            <img
              src={activeAgent.avatar}
              alt={activeAgent.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{activeAgent.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{activeAgent.role} · {activeAgent.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
