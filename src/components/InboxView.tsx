import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Search, 
  Send, 
  Paperclip, 
  Mic, 
  Calendar, 
  CheckCheck, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Lock, 
  Clock, 
  Phone, 
  Mail, 
  Tag, 
  Plus, 
  Smile, 
  User, 
  ChevronRight, 
  Play, 
  Pause, 
  FileText, 
  Check, 
  Info,
  CalendarPlus
} from 'lucide-react';
import { 
  Contact, 
  Message, 
  ChannelType, 
  TicketStatus, 
  AgentUser, 
  Appointment, 
  QuickReply 
} from '../types/crm';
import { soundEffects, speakText, stopSpeaking } from '../utils/audio';

interface InboxViewProps {
  contacts: Contact[];
  messages: Record<string, Message[]>;
  selectedContactId: string;
  onSelectContact: (id: string) => void;
  onSendMessage: (contactId: string, text: string, isAudio?: boolean, audioTranscription?: string) => void;
  onUpdateContactStatus: (contactId: string, status: TicketStatus) => void;
  onOpenScheduleModal: (contact?: Contact) => void;
  appointments: Appointment[];
  agents: AgentUser[];
  quickReplies: QuickReply[];
  showSubtitles: boolean;
  screenReaderActive: boolean;
}

export const InboxView: React.FC<InboxViewProps> = ({
  contacts,
  messages,
  selectedContactId,
  onSelectContact,
  onSendMessage,
  onUpdateContactStatus,
  onOpenScheduleModal,
  appointments,
  agents,
  quickReplies,
  showSubtitles,
  screenReaderActive,
}) => {
  const [channelFilter, setChannelFilter] = useState<'all' | ChannelType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [showContactDetails, setShowContactDetails] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];
  const activeMessages = selectedContact ? messages[selectedContact.id] || [] : [];
  const contactAppointments = appointments.filter((a) => a.contactId === selectedContact?.id);

  // Auto scroll para o final das mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, selectedContactId]);

  // Filtro de contatos
  const filteredContacts = contacts.filter((c) => {
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.handle && c.handle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesChannel && matchesStatus && matchesSearch;
  });

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedContact) return;

    soundEffects.playSentMessage();
    onSendMessage(selectedContact.id, inputText.trim());
    setInputText('');
  };

  const handleSendAudioSimulated = () => {
    if (!selectedContact) return;
    soundEffects.playSentMessage();
    const transcription = 'Olá! Mensagem de voz gravada pelo atendente confirmando os detalhes do atendimento.';
    onSendMessage(selectedContact.id, 'Mensagem de voz enviada (0:15)', true, transcription);
  };

  const handleInsertQuickReply = (reply: QuickReply) => {
    setInputText(reply.message);
    setShowQuickReplies(false);
  };

  const getChannelBadge = (channel: ChannelType) => {
    switch (channel) {
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
            Instagram Direct
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            <Facebook className="w-3.5 h-3.5 fill-blue-600" />
            Messenger
          </span>
        );
    }
  };

  const getChannelColorClasses = (channel: ChannelType) => {
    switch (channel) {
      case 'whatsapp':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      case 'instagram':
        return 'text-pink-600 bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800';
      case 'facebook':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* ================= COLUNA 1: LISTA DE CONVERSAS ================= */}
      <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        {/* Barra de Filtros e Busca */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, telefone ou tag..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              aria-label="Campo de busca de conversas"
            />
          </div>

          {/* Abas de Canais */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              onClick={() => setChannelFilter('all')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
                channelFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setChannelFilter('whatsapp')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1 ${
                channelFilter === 'whatsapp'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              WhatsApp
            </button>
            <button
              onClick={() => setChannelFilter('instagram')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1 ${
                channelFilter === 'instagram'
                  ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-xs'
                  : 'text-slate-500 hover:text-pink-600'
              }`}
            >
              <Instagram className="w-3 h-3" />
              IG
            </button>
            <button
              onClick={() => setChannelFilter('facebook')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1 ${
                channelFilter === 'facebook'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              <Facebook className="w-3 h-3" />
              FB
            </button>
          </div>

          {/* Filtros de Status */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
            <span>Filtro de Fila:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-1.5 py-0.5 rounded transition ${statusFilter === 'all' ? 'font-bold text-emerald-600' : 'hover:text-slate-900'}`}
              >
                Todas
              </button>
              <button
                onClick={() => setStatusFilter('open')}
                className={`px-1.5 py-0.5 rounded transition ${statusFilter === 'open' ? 'font-bold text-amber-600' : 'hover:text-slate-900'}`}
              >
                Abertas
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-1.5 py-0.5 rounded transition ${statusFilter === 'in_progress' ? 'font-bold text-blue-600' : 'hover:text-slate-900'}`}
              >
                Em Atend.
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Contatos */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Nenhuma conversa encontrada neste filtro.
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isSelected = contact.id === selectedContact?.id;

              return (
                <button
                  key={contact.id}
                  onClick={() => onSelectContact(contact.id)}
                  className={`w-full p-3.5 text-left transition flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-l-4 border-emerald-500'
                      : ''
                  }`}
                >
                  {/* Avatar com badge do canal */}
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-slate-900 shadow-xs">
                      {contact.channel === 'whatsapp' && (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <MessageSquare className="w-2.5 h-2.5 fill-white" />
                        </div>
                      )}
                      {contact.channel === 'instagram' && (
                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center">
                          <Instagram className="w-2.5 h-2.5" />
                        </div>
                      )}
                      {contact.channel === 'facebook' && (
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Facebook className="w-2.5 h-2.5 fill-white" />
                        </div>
                      )}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs md:text-sm text-slate-900 dark:text-slate-100 truncate">
                        {contact.name}
                      </span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 shrink-0">
                        {contact.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {contact.lastMessage}
                    </p>

                    {/* Metadados: tags e unread */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                        {contact.tags.slice(0, 1).map((t, idx) => (
                          <span key={idx} className="font-medium">#{t}</span>
                        ))}
                      </div>

                      {contact.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ================= COLUNA 2: CHAT ATIVO ================= */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
        {selectedContact ? (
          <>
            {/* Header do Chat */}
            <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm md:text-base text-slate-900 dark:text-white truncate">
                      {selectedContact.name}
                    </h2>
                    {getChannelBadge(selectedContact.channel)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{selectedContact.handle || selectedContact.phone}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <Lock className="w-3 h-3" />
                      E2EE Ativo
                    </span>
                  </div>
                </div>
              </div>

              {/* Ações do Header */}
              <div className="flex items-center gap-2">
                {/* Botão de Agendar Horário Rápido */}
                <button
                  type="button"
                  onClick={() => onOpenScheduleModal(selectedContact)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition shadow-xs"
                  title="Agendar horário para este cliente"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-teal-600" />
                  <span className="hidden sm:inline">Agendar Horário</span>
                </button>

                {/* Status do Atendimento */}
                <select
                  value={selectedContact.status}
                  onChange={(e) => onUpdateContactStatus(selectedContact.id, e.target.value as TicketStatus)}
                  className="text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  aria-label="Status do atendimento"
                >
                  <option value="open">🟢 Aberto</option>
                  <option value="in_progress">🔵 Em Atendimento</option>
                  <option value="pending">🟡 Pendente</option>
                  <option value="resolved">✅ Resolvido</option>
                </select>

                {/* Alternar detalhes do cliente */}
                <button
                  type="button"
                  onClick={() => setShowContactDetails(!showContactDetails)}
                  className={`p-2 rounded-xl border transition ${
                    showContactDetails
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Exibir ficha do cliente e LGPD"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Banner de Criptografia e Conformidade LGPD */}
            <div className="px-4 py-1.5 bg-slate-100/80 dark:bg-slate-800/40 border-b border-slate-200/50 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                Canal auditado pelo OmniFlow Engine. Base legal:{' '}
                <strong className="font-semibold text-slate-700 dark:text-slate-300">Art. 7º V da LGPD</strong> (Execução de Contrato).
              </span>
            </div>

            {/* Fluxo de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
              {activeMessages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                const isBot = msg.sender === 'bot';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[70%] p-3.5 rounded-2xl shadow-xs transition ${
                        isAgent
                          ? 'bg-emerald-600 text-white rounded-tr-xs'
                          : isBot
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs'
                      }`}
                    >
                      {/* Remetente no caso de Bot */}
                      {isBot && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Automação & Bot Omnichannel</span>
                        </div>
                      )}

                      {/* Conteúdo de Áudio com Legenda Dinâmica para Acessibilidade */}
                      {msg.isAudio ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                if (playingAudioId === msg.id) {
                                  stopSpeaking();
                                  setPlayingAudioId(null);
                                } else {
                                  setPlayingAudioId(msg.id);
                                  speakText(msg.audioTranscription || 'Reproduzindo nota de voz recebida.', () => {
                                    setPlayingAudioId(null);
                                  });
                                }
                              }}
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                                isAgent
                                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                  : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                              }`}
                              title="Reproduzir áudio / Sintetizador de voz"
                            >
                              {playingAudioId === msg.id ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4 ml-0.5" />
                              )}
                            </button>

                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold">Nota de Voz</span>
                                <span className="text-[11px] opacity-75">{msg.audioDuration || '0:20'}</span>
                              </div>
                              <div className="w-28 md:w-36 h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                                <div
                                  className={`h-full ${isAgent ? 'bg-white' : 'bg-emerald-500'} ${
                                    playingAudioId === msg.id ? 'w-full transition-all duration-3000' : 'w-1/3'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Legendas Dinâmicas / Transcrição em Tempo Real (Acessibilidade) */}
                          {showSubtitles && msg.audioTranscription && (
                            <div className={`p-2.5 rounded-xl text-xs leading-relaxed border ${
                              isAgent 
                                ? 'bg-emerald-700/60 border-emerald-500 text-white' 
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                            }`}>
                              <span className="font-semibold block text-[10px] uppercase tracking-wider opacity-80 mb-0.5">
                                [Legenda Dinâmica / Transcrição Automática]
                              </span>
                              "{msg.audioTranscription}"
                            </div>
                          )}
                        </div>
                      ) : msg.hasAttachments ? (
                        /* Mensagem com Anexo */
                        <div className="space-y-2">
                          <p className="text-sm">{msg.text}</p>
                          <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                            isAgent
                              ? 'bg-emerald-700/50 border-emerald-500 text-white'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                          }`}>
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-red-500 shrink-0" />
                              <div className="text-xs truncate">
                                <span className="font-semibold block truncate">{msg.attachmentName}</span>
                                <span className="text-[10px] opacity-75">Documento Verificado · PDF (340 KB)</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => alert(`Visualizando documento: ${msg.attachmentName}`)}
                              className="text-xs underline font-semibold shrink-0"
                            >
                              Abrir
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Mensagem de Texto Normal */
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Rodapé da Mensagem: Horário, Leitor de Voz e Status */}
                      <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
                        isAgent ? 'text-emerald-100' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {/* Botão de Leitor de Tela para Deficientes Visuais */}
                        <button
                          type="button"
                          onClick={() => speakText(msg.text || msg.audioTranscription || '')}
                          title="Ler esta mensagem em voz alta (Acessibilidade)"
                          className="hover:scale-110 transition opacity-80 hover:opacity-100"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>

                        <span title="Criptografada ponta-a-ponta" className="inline-flex">
                          <Lock className="w-2.5 h-2.5 opacity-60" />
                        </span>
                        <span>{msg.timestamp}</span>

                        {isAgent && (
                          <CheckCheck className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Barra de Respostas Rápidas */}
            {showQuickReplies && (
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Respostas Rápidas & Atalhos (/atalho)
                  </span>
                  <button
                    onClick={() => setShowQuickReplies(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Fechar
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {quickReplies.map((qr) => (
                    <button
                      key={qr.id}
                      onClick={() => handleInsertQuickReply(qr)}
                      className="p-2 text-left rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs"
                    >
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-2">
                        {qr.shortcut}
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium">{qr.title}</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                        {qr.message}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Barra de Entrada de Mensagem */}
            <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <form onSubmit={handleSend} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>Respondendo via:</span>
                    {getChannelBadge(selectedContact.channel)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                      className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>⚡ Respostas Rápidas (/atalhos)</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
                  {/* Botões de Ação à esquerda */}
                  <div className="flex items-center gap-1 pb-1">
                    <button
                      type="button"
                      onClick={() => alert('Simulador: anexo de imagens, comprovantes e PDFs criptografados pronto.')}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700 transition"
                      title="Anexar arquivo ou PDF"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSendAudioSimulated}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700 transition"
                      title="Gravar nota de voz simulada com transcrição automática"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Input de texto */}
                  <textarea
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={`Escreva sua mensagem para ${selectedContact.name}... (Enter para enviar)`}
                    className="flex-1 max-h-32 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden resize-none py-1.5"
                    aria-label="Campo de digitação de mensagem"
                  />

                  {/* Botão Enviar */}
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`p-2.5 rounded-xl font-medium transition flex items-center justify-center shrink-0 ${
                      inputText.trim()
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                    title="Enviar Mensagem"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              Nenhuma conversa selecionada
            </p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Selecione um contato na lista à esquerda para iniciar o atendimento centralizado.
            </p>
          </div>
        )}
      </div>

      {/* ================= COLUNA 3: PAINEL LATERAL DO CLIENTE & LGPD ================= */}
      {selectedContact && showContactDetails && (
        <div className="hidden xl:flex w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col overflow-y-auto shrink-0">
          {/* Header do Perfil */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 text-center">
            <img
              src={selectedContact.avatar}
              alt={selectedContact.name}
              className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-slate-100 dark:ring-slate-800 shadow-xs"
            />
            <h3 className="font-bold text-base text-slate-900 dark:text-white mt-3">
              {selectedContact.name}
            </h3>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              {getChannelBadge(selectedContact.channel)}
            </div>

            {/* Ação rápida: Agendar */}
            <button
              onClick={() => onOpenScheduleModal(selectedContact)}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Novo Horário</span>
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* Contato & Identificação */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Dados do Contato
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedContact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{selectedContact.email}</span>
                </div>
                {selectedContact.handle && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Instagram className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedContact.handle}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Agendamentos Cadastrados */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Agendamentos
                </span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  {contactAppointments.length}
                </span>
              </div>

              {contactAppointments.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center text-xs text-slate-400">
                  Nenhum horário marcado ainda.
                </div>
              ) : (
                contactAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/60 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-teal-800 dark:text-teal-300">
                      <span>{apt.date} · {apt.time}</span>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                        {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium truncate">{apt.service}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Profissional: {apt.agentName}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Tags do Cliente */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Etiquetas / Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedContact.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Notas Internas */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Notas do Atendente
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 leading-relaxed">
                {selectedContact.notes || 'Sem observações adicionais.'}
              </p>
            </div>

            {/* Segurança & LGPD */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Privacidade LGPD</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <p>Consentimento: <strong className="text-emerald-600 font-semibold">Válido</strong> ({selectedContact.lgpdConsentDate})</p>
                <p className="truncate font-mono text-[10px] text-slate-400">
                  Fingerprint: {selectedContact.e2eeFingerprint.slice(0, 24)}...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
