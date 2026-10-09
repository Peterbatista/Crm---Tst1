import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Send, 
  CheckCircle2, 
  Clock, 
  Headphones, 
  X, 
  MessageSquare, 
  ShieldCheck, 
  Zap,
  PhoneCall
} from 'lucide-react';

interface Support24hModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SupportChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  time: string;
}

export const Support24hModal: React.FC<Support24hModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<SupportChatMessage[]>([
    {
      id: 'sup-1',
      sender: 'support',
      text: 'Olá! Bem-vindo à Central de Suporte Técnico 24h do OmniFlow CRM. Sou o Engenheiro Rafael (Nível 3). Nosso SLA de primeira resposta é de até 5 minutos. Como posso te auxiliar neste momento?',
      time: '13:50',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: SupportChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Resposta automática do suporte
    setTimeout(() => {
      const resp: SupportChatMessage = {
        id: `sup-${Date.now()}`,
        sender: 'support',
        text: 'Chamado protocolado (#TK-98421). Estou verificando a telemetria dos webhooks e a integridade do cluster PostgreSQL. Tudo permanece 100% operacional. Precisa de apoio com alguma configuração de agendamento ou canal?',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, resp]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  Suporte Técnico Especializado 24h
                </h2>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Plantão 24/7 Ativo
                </span>
              </div>
              <p className="text-xs text-slate-500">Engenharia de Infraestrutura e Integrações Meta</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status dos Servidores */}
        <div className="px-5 py-2.5 bg-slate-100/60 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] overflow-x-auto gap-4">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>WhatsApp Cloud API: <strong>99.99%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Instagram Direct: <strong>99.98%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>PostgreSQL: <strong>Saudável</strong></span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Node.js WebSockets: <strong>14ms</strong></span>
          </div>
        </div>

        {/* Chat com Suporte */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-xs shadow-xs'
                }`}
              >
                {m.text}
                <div
                  className={`text-[10px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-sky-100' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Descreva sua dúvida técnica ou solicitação urgente..."
            className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-40 transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
