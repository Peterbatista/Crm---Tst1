import React from 'react';
import { Wifi, Battery, Signal, ArrowLeft, Home, Square, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onExitAndroidMode: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onExitAndroidMode,
}) => {
  return (
    <div className="flex-1 bg-slate-900/90 dark:bg-black/95 flex flex-col items-center justify-center p-2 sm:p-6 overflow-y-auto">
      {/* Botão de Controle Superior */}
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={onExitAndroidMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition shadow-md"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Voltar para Modo Web Desktop</span>
        </button>
        <span className="text-xs text-slate-400">
          Simulador Android / Flutter PWA
        </span>
      </div>

      {/* Carcaça do Aparelho Android */}
      <div className="w-full max-w-[410px] h-[780px] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-700/60 relative flex flex-col">
        {/* Notch / Câmera Frontal */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900 ring-1 ring-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
          </div>
        </div>

        {/* Barra de Status Android */}
        <div className="h-7 bg-white dark:bg-slate-900 rounded-t-[36px] px-6 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 z-30 shrink-0">
          <span>13:50</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <span className="text-[9px] font-bold">5G</span>
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Conteúdo da Tela do Smartphone */}
        <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col relative">
          {children}
        </div>

        {/* Barra de Navegação Inferior Android (Pill gesture bar) */}
        <div className="h-6 bg-white dark:bg-slate-900 rounded-b-[36px] flex items-center justify-center shrink-0 z-30">
          <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
