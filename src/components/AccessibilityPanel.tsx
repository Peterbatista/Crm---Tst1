import React from 'react';
import { Volume2, VolumeX, Eye, Type, Sparkles, Check, X, BellRing } from 'lucide-react';
import { soundEffects, speakText, stopSpeaking } from '../utils/audio';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (val: 'normal' | 'large' | 'xlarge') => void;
  screenReaderActive: boolean;
  setScreenReaderActive: (val: boolean) => void;
  hearingAlertVisual: boolean;
  setHearingAlertVisual: (val: boolean) => void;
  showSubtitles: boolean;
  setShowSubtitles: (val: boolean) => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose,
  highContrast,
  setHighContrast,
  fontSize,
  setFontSize,
  screenReaderActive,
  setScreenReaderActive,
  hearingAlertVisual,
  setHearingAlertVisual,
  showSubtitles,
  setShowSubtitles,
}) => {
  if (!isOpen) return null;

  const testSpeech = () => {
    soundEffects.playNewMessage();
    speakText('Recurso de leitor de tela do OmniFlow CRM ativado com sucesso. Sistema acessível para deficientes visuais e auditivos em conformidade com as normas WCAG.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Painel de Acessibilidade Universal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Acessibilidade Universal</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Recursos para inclusão visual, auditiva e motora (WCAG AA)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Fechar painel de acessibilidade"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Tamanho da Fonte */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Type className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Tamanho do Texto (Escala Tipográfica)
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ajuste para melhor leitura sem quebrar a harmonia visual.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`py-2 px-3 text-sm font-medium rounded-xl border transition flex items-center justify-center gap-1.5 ${
                  fontSize === 'normal'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {fontSize === 'normal' && <Check className="w-4 h-4" />}
                Padrão (100%)
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`py-2 px-3 text-sm font-medium rounded-xl border transition flex items-center justify-center gap-1.5 ${
                  fontSize === 'large'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {fontSize === 'large' && <Check className="w-4 h-4" />}
                Médio (112%)
              </button>
              <button
                type="button"
                onClick={() => setFontSize('xlarge')}
                className={`py-2 px-3 text-sm font-medium rounded-xl border transition flex items-center justify-center gap-1.5 ${
                  fontSize === 'xlarge'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {fontSize === 'xlarge' && <Check className="w-4 h-4" />}
                Grande (125%)
              </button>
            </div>
          </div>

          {/* Alto Contraste */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Modo de Alto Contraste</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Aumenta nitidez e bordas de foco para baixa visão</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={highContrast}
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                highContrast ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  highContrast ? 'translate-x-6.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Leitor de Tela Sintetizado por Voz */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-start gap-3">
              <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Leitor de Voz (Text-to-Speech pt-BR)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Lê mensagens e alertas em voz alta em português</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={testSpeech}
                title="Testar áudio de voz"
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 hover:bg-emerald-200 transition"
              >
                Testar Voz
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={screenReaderActive}
                onClick={() => {
                  if (screenReaderActive) stopSpeaking();
                  setScreenReaderActive(!screenReaderActive);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                  screenReaderActive ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    screenReaderActive ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Legendas Dinâmicas em Áudios */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-start gap-3">
              <VolumeX className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Legendas Dinâmicas & Transcrição</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Exibe transcrição textual imediata de notas de voz</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showSubtitles}
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                showSubtitles ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  showSubtitles ? 'translate-x-6.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Alerta Visual Luminoso para Deficientes Auditivos */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-start gap-3">
              <BellRing className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Alerta Visual Luminoso</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pulsar de luz na tela ao receber novas mensagens</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={hearingAlertVisual}
              onClick={() => setHearingAlertVisual(!hearingAlertVisual)}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                hearingAlertVisual ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  hearingAlertVisual ? 'translate-x-6.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-sm"
          >
            Concluir & Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
