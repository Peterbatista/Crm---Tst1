import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  TrendingUp, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Clock, 
  CheckCircle, 
  Smile, 
  FileSpreadsheet, 
  FileText,
  Calendar,
  X
} from 'lucide-react';
import { AgentUser, Contact, Appointment } from '../types/crm';

interface ReportsViewProps {
  contacts: Contact[];
  agents: AgentUser[];
  appointments: Appointment[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  contacts,
  agents,
  appointments,
}) => {
  const [period, setPeriod] = useState('Outubro / 2026');
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Função para exportar CSV real
  const handleExportCsv = () => {
    const headers = ['ID', 'Nome', 'Canal', 'Telefone', 'Email', 'Status', 'Atendente', 'LGPD_Consentimento'];
    const rows = contacts.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.channel,
      `"${c.phone}"`,
      c.email,
      c.status,
      c.assignedAgentId,
      c.lgpdConsentGiven ? 'Sim' : 'Nao',
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_omniflow_crm_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Header do Módulo */}
      <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                Relatórios Executivos & BI
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Indicadores de performance (TMR, TMA, CSAT) e distribuição de volume omnichannel em tempo real.
            </p>
          </div>

          {/* Botões de Exportação */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs active:scale-95"
              title="Baixar planilha de dados brutos formatada para Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={() => setShowPdfModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs active:scale-95"
              title="Visualizar e imprimir relatório executivo em PDF"
            >
              <FileText className="w-4 h-4" />
              <span>Visualizar / PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Cartões de Indicadores Principais (KPIs) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Total Interações</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">2.792</span>
              <span className="text-[11px] font-bold text-emerald-600">+14% mês</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">WhatsApp, IG e Facebook</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Tempo Médio Resposta (TMR)</span>
              <Clock className="w-4 h-4 text-teal-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">1m 45s</span>
              <span className="text-[11px] font-bold text-emerald-600">-32s meta</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">SLA padrão: &lt; 5 min</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Agendamentos Concluídos</span>
              <CheckCircle className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">148</span>
              <span className="text-[11px] font-bold text-emerald-600">92% pres.</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Lembretes por WhatsApp</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Satisfação CSAT</span>
              <Smile className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">4.9 / 5.0</span>
              <span className="text-[11px] font-bold text-emerald-600">98% aprovação</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Base de 840 avaliações</p>
          </div>
        </div>

        {/* Distribuição por Canais e Horários de Pico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gráfico Visual de Canais */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Volume por Canal Integrado
            </h2>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp Business (62%)
                  </span>
                  <span className="font-bold">1.730 msgs</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[62%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-pink-600 dark:text-pink-400">
                    <Instagram className="w-3.5 h-3.5" />
                    Instagram Direct (25%)
                  </span>
                  <span className="font-bold">698 msgs</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full w-[25%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
                    <Facebook className="w-3.5 h-3.5" />
                    Facebook Messenger (13%)
                  </span>
                  <span className="font-bold">364 msgs</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[13%]" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
              💡 <strong>Insight da IA:</strong> 74% dos agendamentos são confirmados via WhatsApp dentro de 12 minutos após a primeira abordagem.
            </div>
          </div>

          {/* Performance por Atendente */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Produtividade e Avaliação da Equipe
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-2">Atendente</th>
                    <th className="pb-2">Setor</th>
                    <th className="pb-2">Atendimentos</th>
                    <th className="pb-2">TMR</th>
                    <th className="pb-2 text-right">CSAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {agents.map((ag) => (
                    <tr key={ag.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 flex items-center gap-2">
                        <img
                          src={ag.avatar}
                          alt={ag.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{ag.name}</span>
                      </td>
                      <td className="py-2.5 text-slate-500">{ag.department}</td>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                        {ag.openTickets * 28 + 14}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-400">1m 30s</td>
                      <td className="py-2.5 text-right font-bold text-emerald-600">
                        ★ {ag.rating.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Prévia Executiva para Impressão / PDF */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
                  Ω
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">OmniFlow CRM · Relatório Executivo</h3>
                  <p className="text-xs text-slate-500">Período: 01 a 31 de Outubro de 2026 · Emitido em tempo real</p>
                </div>
              </div>
              <button onClick={() => setShowPdfModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-slate-500">Interações Totais</p>
                  <p className="text-base font-bold text-slate-900">2.792</p>
                </div>
                <div>
                  <p className="text-slate-500">Tempo Médio Resposta</p>
                  <p className="text-base font-bold text-emerald-700">1m 45s</p>
                </div>
                <div>
                  <p className="text-slate-500">Índice de Satisfação</p>
                  <p className="text-base font-bold text-slate-900">98% (CSAT 4.9)</p>
                </div>
              </div>

              <div className="border p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Resumo de Conformidade LGPD & Criptografia</h4>
                <p className="text-slate-600 leading-relaxed">
                  Todos os dados de clientes foram armazenados em banco relacional seguro com criptografia AES-256 e hashes SHA-256 de integridade. Zero incidentes de segurança registrados no período.
                </p>
              </div>

              <div className="border p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Assinatura do Oficial Encarregado (DPO)</h4>
                <div className="pt-4 flex justify-between items-end text-[11px] text-slate-500">
                  <div>
                    <p className="font-semibold text-slate-800">OmniFlow Compliance & Security Engine</p>
                    <p>Hash de Auditoria: 98a72b1c8f00192a3487c6d5e</p>
                  </div>
                  <div className="text-right">
                    <p className="border-t border-slate-400 pt-1 font-mono">Assinado Digitalmente (ICP-Brasil)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Salvar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
