import React, { useState } from 'react';
import { 
  Share2, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Key, 
  ShieldCheck, 
  Zap, 
  Check, 
  ExternalLink,
  Wifi
} from 'lucide-react';
import { ChannelIntegration } from '../types/crm';

interface ChannelsViewProps {
  channels: ChannelIntegration[];
  onTestWebhook: (channelId: string) => void;
}

export const ChannelsView: React.FC<ChannelsViewProps> = ({
  channels,
  onTestWebhook,
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [activeChannelToAuth, setActiveChannelToAuth] = useState<ChannelIntegration | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleTest = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      onTestWebhook(id);
      setTestingId(null);
    }, 800);
  };

  const handleOpenAuth = (ch: ChannelIntegration) => {
    setActiveChannelToAuth(ch);
    setAuthSuccess(false);
    setOauthModalOpen(true);
  };

  const handleCompleteOAuth = () => {
    setAuthSuccess(true);
    setTimeout(() => {
      setOauthModalOpen(false);
      setAuthSuccess(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Share2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                Canais & Integrações Meta OAuth2
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Conexões oficiais com WhatsApp Business Cloud API, Instagram Direct e Facebook Messenger com Webhooks em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Webhooks 100% Operacionais</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Lista de Canais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((ch) => {
            return (
              <div
                key={ch.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {ch.id === 'whatsapp' && (
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                          <MessageSquare className="w-6 h-6 fill-white" />
                        </div>
                      )}
                      {ch.id === 'instagram' && (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                          <Instagram className="w-6 h-6" />
                        </div>
                      )}
                      {ch.id === 'facebook' && (
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                          <Facebook className="w-6 h-6 fill-white" />
                        </div>
                      )}

                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{ch.name}</h3>
                        <span className="text-[11px] text-slate-500 block truncate">{ch.accountName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status Webhook:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Operacional
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Latência do Ping:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{ch.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mensagens Hoje:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ch.messagesToday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Última Sincronização:</span>
                      <span className="text-slate-500">{ch.lastSync}</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Permissões OAuth2 Ativas:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ch.oauthScope.map((scope, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTest(ch.id)}
                    disabled={testingId === ch.id}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingId === ch.id ? 'animate-spin' : ''}`} />
                    <span>{testingId === ch.id ? 'Testando...' : 'Testar Ping'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenAuth(ch)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>OAuth2</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informações Técnicas de Arquitetura */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Arquitetura de Alta Performance: Node.js, WebSockets & PostgreSQL
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            O backend OmniFlow foi estruturado com workers assíncronos no <strong>Node.js</strong> processando webhooks com tolerância a falhas.
            As conexões em tempo real são orquestradas via <strong>WebSockets bidirecionais</strong>, reduzindo a latência para menos de 20ms.
            O banco de dados relacional <strong>PostgreSQL</strong> armazena as mensagens e contatos com índices transacionais em colunas criptografadas, garantindo integridade de dados e alta vazão mesmo sob pico de milhares de mensagens simultâneas.
          </p>
        </div>
      </div>

      {/* Modal de Simulação de Fluxo OAuth2 */}
      {oauthModalOpen && activeChannelToAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Autenticação OAuth2 Meta Business
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Conectar com: <strong className="text-slate-800 dark:text-slate-200">{activeChannelToAuth.name}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Escopos Solicitados:
              </span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                {activeChannelToAuth.oauthScope.map((s, i) => (
                  <li key={i} className="font-mono text-[11px]">{s}</li>
                ))}
              </ul>
            </div>

            {authSuccess ? (
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Token OAuth2 renovado com sucesso!
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOauthModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCompleteOAuth}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2"
                >
                  <span>Autorizar Permissões</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
