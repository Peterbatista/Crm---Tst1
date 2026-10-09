import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  FileCheck, 
  UserCheck, 
  FileSpreadsheet, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Info,
  History,
  Download
} from 'lucide-react';
import { Contact, AuditLog } from '../types/crm';

interface LgpdViewProps {
  contacts: Contact[];
  auditLogs: AuditLog[];
  onAnonymizeContact: (contactId: string) => void;
}

export const LgpdView: React.FC<LgpdViewProps> = ({
  contacts,
  auditLogs,
  onAnonymizeContact,
}) => {
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || '');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const handleExportTitularReport = () => {
    if (!selectedContact) return;
    const reportData = {
      titular: selectedContact.name,
      telefone: selectedContact.phone,
      email: selectedContact.email,
      canal: selectedContact.channel,
      base_legal: 'Art. 7º, inciso V da Lei nº 13.709/2018 (Execução de Contrato)',
      consentimento_registrado_em: selectedContact.lgpdConsentDate,
      criptografia_fingerprint: selectedContact.e2eeFingerprint,
      tags: selectedContact.tags,
      timestamp_emissao: new Date().toISOString(),
      politica_privacidade: 'Conforme art. 18 da LGPD, os dados foram exportados em formato estruturado e interoperável.',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_titular_lgpd_${selectedContact.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSuccessMessage(`Relatório do Titular exportado com sucesso para ${selectedContact.name}.`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleAnonymize = () => {
    if (!selectedContact) return;
    if (confirm(`Atenção: Você tem certeza que deseja anonimizar irreversivelmente os dados de ${selectedContact.name} conforme o Art. 18, VI da LGPD?`)) {
      onAnonymizeContact(selectedContact.id);
      setSuccessMessage(`Dados de ${selectedContact.name} anonimizados com sucesso.`);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Topo do Módulo LGPD */}
      <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                LGPD, Criptografia & Privacidade de Dados
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Conformidade total com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), criptografia de ponta a ponta e gestão de direitos do titular.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>AES-256-GCM Ativo</span>
            </span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="m-4 md:m-6 p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>✓ {successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      <div className="p-4 md:p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Painel de Status de Segurança */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Criptografia E2EE</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Ponta a Ponta</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Todas as mensagens de WhatsApp, Instagram e Facebook trafegam com chaves assimétricas e são salvas com hash SHA-256.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
              <FileCheck className="w-4 h-4" />
              <span>Bases Legais LGPD</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Artigos 7º e 11º</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tratamento embasado em Execução de Contrato (Inciso V) e Consentimento Expresso com termo assinado digitalmente.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
              <UserCheck className="w-4 h-4" />
              <span>DPO & Auditoria</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Logs Imutáveis</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rastreamento de cada visualização de dados cadastrais, telefone, e-mail e notas por operador com IP registrado.
            </p>
          </div>
        </div>

        {/* Gerenciamento de Direitos do Titular (Art. 18 LGPD) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Portal de Atendimento aos Direitos do Titular (Art. 18)
              </h2>
              <p className="text-xs text-slate-500">
                Selecione um cliente para exportar relatório completo de dados ou processar anonimização (direito ao esquecimento).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cliente:</span>
              <select
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedContact && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedContact.name}</h4>
                    <p className="text-slate-500">{selectedContact.email} · {selectedContact.phone}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <p className="text-slate-700 dark:text-slate-300 font-semibold">
                    Hash Criptográfico de Integridade:
                  </p>
                  <p className="font-mono text-[11px] text-slate-500 truncate">
                    {selectedContact.e2eeFingerprint}
                  </p>
                </div>

                <div className="text-[11px] text-slate-500">
                  Consentimento registrado em: <strong className="text-slate-700 dark:text-slate-300">{selectedContact.lgpdConsentDate}</strong>
                </div>
              </div>

              {/* Botões de Ação do Titular */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleExportTitularReport}
                  className="w-full p-3 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition flex items-center justify-between text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Exportar Relatório do Titular (JSON Estruturado)</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-200/60 dark:bg-emerald-900 px-2 py-0.5 rounded">
                    Art. 18, V
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleAnonymize}
                  className="w-full p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 transition flex items-center justify-between text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>Anonimizar Dados Pessoais (Direito ao Esquecimento)</span>
                  </div>
                  <span className="text-[10px] text-red-700 bg-red-200/60 dark:bg-red-900 px-2 py-0.5 rounded">
                    Art. 18, VI
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabela de Logs de Auditoria */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Trilha de Auditoria & Registro de Acessos
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-2.5">Data & Hora</th>
                  <th className="pb-2.5">Operador</th>
                  <th className="pb-2.5">Ação Realizada</th>
                  <th className="pb-2.5">Titular Consultado</th>
                  <th className="pb-2.5">Base Legal LGPD</th>
                  <th className="pb-2.5">Origem IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{log.agentName}</td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">{log.action}</td>
                    <td className="py-3 text-slate-800 dark:text-slate-200">{log.targetContact}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {log.legalBasis}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
