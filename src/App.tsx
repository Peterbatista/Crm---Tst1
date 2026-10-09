/**
 * OmniFlow CRM - Central de Atendimento & Agendamento Omnichannel
 * WhatsApp, Instagram Direct e Facebook Messenger
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { InboxView } from './components/InboxView';
import { CalendarView } from './components/CalendarView';
import { ContactsView } from './components/ContactsView';
import { ReportsView } from './components/ReportsView';
import { LgpdView } from './components/LgpdView';
import { TeamView } from './components/TeamView';
import { ChannelsView } from './components/ChannelsView';
import { Support24hModal } from './components/Support24hModal';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { AndroidFrame } from './components/AndroidFrame';

import { 
  initialAgents, 
  initialContacts, 
  initialMessages, 
  initialAppointments, 
  initialQuickReplies, 
  initialAuditLogs, 
  initialChannels 
} from './data/initialData';

import { 
  Contact, 
  Message, 
  Appointment, 
  AgentUser, 
  AuditLog, 
  TicketStatus, 
  ChannelType 
} from './types/crm';

import { soundEffects, speakText } from './utils/audio';

export default function App() {
  // Estado de Tema e Preferências
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('omniflow_theme') === 'dark' || true; // Padrão escuro elegante
    }
    return true;
  });

  const [viewMode, setViewMode] = useState<'desktop' | 'android'>('desktop');
  const [currentTab, setCurrentTab] = useState<TabType>('inbox');

  // Acessibilidade
  const [isAccessPanelOpen, setIsAccessPanelOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [screenReaderActive, setScreenReaderActive] = useState(false);
  const [hearingAlertVisual, setHearingAlertVisual] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isVisualFlashing, setIsVisualFlashing] = useState(false);

  // Modal Suporte 24h
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Dados do CRM
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [selectedContactId, setSelectedContactId] = useState<string>(initialContacts[0]?.id || '');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [agents, setAgents] = useState<AgentUser[]>(initialAgents);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [channels, setChannels] = useState(initialChannels);

  // Conexão WebSocket Simulada
  const [webSocketStatus, setWebSocketStatus] = useState<'connected' | 'reconnecting'>('connected');

  // Sincroniza Dark Mode no <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('omniflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('omniflow_theme', 'light');
    }
  }, [darkMode]);

  // Aplica classe de alto contraste
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Aplica classe de tamanho de fonte
  useEffect(() => {
    document.body.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    document.body.classList.add(`text-size-${fontSize}`);
  }, [fontSize]);

  // Total de mensagens não lidas
  const unreadTotal = contacts.reduce((acc, c) => acc + c.unreadCount, 0);
  const appointmentsTodayCount = appointments.filter((a) => a.date === '2026-10-15').length;
  const activeAgent = agents[0] || initialAgents[0];

  // Dispara alerta visual e sonoro de acessibilidade
  const triggerAccessibilityAlert = (textNotification: string) => {
    soundEffects.playNewMessage();

    if (hearingAlertVisual) {
      setIsVisualFlashing(true);
      setTimeout(() => setIsVisualFlashing(false), 1500);
    }

    if (screenReaderActive) {
      speakText(textNotification);
    }
  };

  // Simular recebimento de mensagem em tempo real de clientes
  const handleSimulateIncomingMessage = () => {
    const randomTemplates = [
      {
        channel: 'whatsapp' as ChannelType,
        text: 'Olá! Gostaria de saber mais sobre os planos do CRM e se vocês têm horário para uma demonstração hoje à tarde.',
        name: 'Carolina Prado',
        phone: '+55 (11) 97654-1122',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      },
      {
        channel: 'instagram' as ChannelType,
        text: 'Oi equipe! Amei o post no feed sobre centralização de mensagens. O sistema já integra com o Instagram Direct oficial?',
        name: 'Tiago Ramos',
        phone: '+55 (31) 98877-3344',
        handle: '@tiago_consultoria',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      {
        channel: 'facebook' as ChannelType,
        text: 'Boa tarde! Como funciona a conformidade com a LGPD e criptografia no armazenamento dos dados?',
        name: 'Renata Albuquerque',
        phone: '+55 (21) 99344-5566',
        handle: 'Renata Albuquerque FB',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
    ];

    const template = randomTemplates[Math.floor(Math.random() * randomTemplates.length)];
    const existingContact = contacts.find((c) => c.phone === template.phone);

    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (existingContact) {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        sender: 'contact',
        text: template.text,
        timestamp: nowTime,
        channel: template.channel,
        status: 'delivered',
        encrypted: true,
      };

      setMessages((prev) => ({
        ...prev,
        [existingContact.id]: [...(prev[existingContact.id] || []), newMsg],
      }));

      setContacts((prev) =>
        prev.map((c) =>
          c.id === existingContact.id
            ? {
                ...c,
                lastMessage: template.text,
                lastMessageTime: nowTime,
                unreadCount: c.unreadCount + 1,
                status: 'open',
              }
            : c
        )
      );

      triggerAccessibilityAlert(`Nova mensagem de ${existingContact.name} no ${template.channel.toUpperCase()}: ${template.text}`);
    } else {
      const newId = `c-${Date.now()}`;
      const newContact: Contact = {
        id: newId,
        name: template.name,
        phone: template.phone,
        email: `${template.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        avatar: template.avatar,
        channel: template.channel,
        handle: template.handle,
        lastMessage: template.text,
        lastMessageTime: nowTime,
        unreadCount: 1,
        status: 'open',
        assignedAgentId: 'agent-1',
        tags: ['Novo Lead', `${template.channel.toUpperCase()} Lead`],
        e2eeFingerprint: `SHA256:${Math.random().toString(16).substring(2, 34)}`,
        lgpdConsentGiven: true,
        lgpdConsentDate: new Date().toLocaleString('pt-BR'),
      };

      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        sender: 'contact',
        text: template.text,
        timestamp: nowTime,
        channel: template.channel,
        status: 'delivered',
        encrypted: true,
      };

      setContacts((prev) => [newContact, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newId]: [newMsg],
      }));
      setSelectedContactId(newId);

      triggerAccessibilityAlert(`Novo cliente ${template.name} entrou em contato via ${template.channel.toUpperCase()}: ${template.text}`);
    }
  };

  // Enviar mensagem como atendente
  const handleSendMessage = (
    contactId: string, 
    text: string, 
    isAudio = false, 
    audioTranscription?: string
  ) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;

    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: `msg-agent-${Date.now()}`,
      sender: 'agent',
      text,
      timestamp: nowTime,
      channel: contact.channel,
      status: 'sent',
      isAudio,
      audioDuration: isAudio ? '0:15' : undefined,
      audioTranscription,
      encrypted: true,
    };

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMsg],
    }));

    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? {
              ...c,
              lastMessage: isAudio ? 'Mensagem de voz gravada' : text,
              lastMessageTime: nowTime,
              unreadCount: 0,
            }
      : c
      )
    );
  };

  // Atualizar status do ticket/atendimento
  const handleUpdateContactStatus = (contactId: string, status: TicketStatus) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, status } : c))
    );
  };

  // Adicionar agendamento
  const handleAddAppointment = (newAptData: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      ...newAptData,
    };

    setAppointments((prev) => [newApt, ...prev]);

    // Enviar mensagem automática de confirmação para o chat do cliente
    const confirmationText = `📅 Agendamento Confirmado! Olá ${newApt.contactName}, seu horário para "${newApt.service}" foi marcado para ${newApt.date} às ${newApt.time} com nosso especialista ${newApt.agentName}. Enviaremos lembretes automáticos por aqui!`;
    handleSendMessage(newApt.contactId, confirmationText);

    // Registra auditoria LGPD
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      agentName: activeAgent.name,
      action: `Agendamento cadastrado: ${newApt.service}`,
      targetContact: newApt.contactName,
      legalBasis: 'Art. 7º I - Consentimento do Titular',
      ipAddress: '189.40.122.14 (São Paulo - SP)',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Atualizar status de agendamento
  const handleUpdateAppointmentStatus = (
    id: string, 
    status: 'confirmed' | 'pending' | 'completed' | 'canceled'
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  // Enviar lembrete oficial de agendamento por WhatsApp
  const handleSendReminderWhatsApp = (apt: Appointment) => {
    soundEffects.playSentMessage();
    const reminderText = `🔔 Lembrete OmniFlow: Olá ${apt.contactName}, confirmamos seu agendamento amanhã (${apt.date}) às ${apt.time} para ${apt.service}. Se precisar remarcar, basta responder esta mensagem.`;
    handleSendMessage(apt.contactId, reminderText);
    alert(`Lembrete de agendamento enviado com sucesso via WhatsApp para ${apt.contactName}!`);
  };

  // Anonimização LGPD (Direito ao Esquecimento)
  const handleAnonymizeContact = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? {
              ...c,
              name: `Titular Anonimizado (LGPD-${c.id})`,
              phone: '+55 (XX) 9XXXX-XXXX',
              email: `anonimizado_${c.id}@privacidade.lgpd`,
              tags: ['Dados Anonimizados', 'Art. 18 LGPD'],
              notes: 'Dados sensíveis e cadastrais removidos irreversivelmente a pedido do titular.',
              anonymized: true,
            }
          : c
      )
    );

    // Log de auditoria
    const newLog: AuditLog = {
      id: `log-anon-${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      agentName: activeAgent.name,
      action: 'Anonimização de dados pessoais (Direito ao Esquecimento)',
      targetContact: `ID: ${contactId}`,
      legalBasis: 'Art. 18, VI - Eliminação e Anonimização de Dados',
      ipAddress: '189.40.122.14 (São Paulo - SP)',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Cadastrar cliente
  const handleAddContact = (newContactData: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      id: `c-${Date.now()}`,
      ...newContactData,
    };
    setContacts((prev) => [newContact, ...prev]);
    setSelectedContactId(newContact.id);
  };

  // Adicionar atendente
  const handleAddAgent = (newAgentData: Omit<AgentUser, 'id'>) => {
    const newAgent: AgentUser = {
      id: `agent-${Date.now()}`,
      ...newAgentData,
    };
    setAgents((prev) => [...prev, newAgent]);
  };

  const handleUpdateAgentStatus = (agentId: string, status: AgentUser['status']) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status } : a))
    );
  };

  // Teste de webhook
  const handleTestWebhook = (channelId: string) => {
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === channelId
          ? {
              ...ch,
              lastSync: 'Agora mesmo',
              latencyMs: Math.floor(12 + Math.random() * 8),
            }
          : ch
      )
    );
  };

  // Conteúdo da Aba Ativa
  const renderTabContent = () => {
    switch (currentTab) {
      case 'inbox':
        return (
          <InboxView
            contacts={contacts}
            messages={messages}
            selectedContactId={selectedContactId}
            onSelectContact={(id) => {
              setSelectedContactId(id);
              // Zera unread count
              setContacts((prev) =>
                prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
              );
            }}
            onSendMessage={handleSendMessage}
            onUpdateContactStatus={handleUpdateContactStatus}
            onOpenScheduleModal={() => setCurrentTab('calendar')}
            appointments={appointments}
            agents={agents}
            quickReplies={initialQuickReplies}
            showSubtitles={showSubtitles}
            screenReaderActive={screenReaderActive}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            appointments={appointments}
            contacts={contacts}
            agents={agents}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onSendReminderWhatsApp={handleSendReminderWhatsApp}
          />
        );
      case 'contacts':
        return (
          <ContactsView
            contacts={contacts}
            onSelectContact={(id) => {
              setSelectedContactId(id);
              setCurrentTab('inbox');
            }}
            onOpenScheduleModal={() => setCurrentTab('calendar')}
            onAddContact={handleAddContact}
          />
        );
      case 'reports':
        return (
          <ReportsView
            contacts={contacts}
            agents={agents}
            appointments={appointments}
          />
        );
      case 'lgpd':
        return (
          <LgpdView
            contacts={contacts}
            auditLogs={auditLogs}
            onAnonymizeContact={handleAnonymizeContact}
          />
        );
      case 'team':
        return (
          <TeamView
            agents={agents}
            onAddAgent={handleAddAgent}
            onUpdateAgentStatus={handleUpdateAgentStatus}
          />
        );
      case 'channels':
        return (
          <ChannelsView
            channels={channels}
            onTestWebhook={handleTestWebhook}
          />
        );
      case 'support':
        return (
          <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-600 mx-auto flex items-center justify-center font-bold">
                🎧
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Suporte Técnico 24h OmniFlow
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nossa equipe de engenharia está à disposição 24 horas por dia para garantir 99.99% de disponibilidade em suas operações de WhatsApp, Instagram e Facebook.
              </p>
              <button
                onClick={() => setIsSupportOpen(true)}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition"
              >
                Abrir Chat com Engenheiro de Plantão
              </button>
            </div>
          </div>
        );
    }
  };

  const appCore = (
    <div className="flex-1 flex overflow-hidden relative">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'support') {
            setIsSupportOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        unreadCount={unreadTotal}
        appointmentsTodayCount={appointmentsTodayCount}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderTabContent()}
      </main>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Alerta Visual Luminoso para Deficientes Auditivos */}
      {isVisualFlashing && (
        <div className="fixed inset-0 pointer-events-none z-50 border-8 border-emerald-500 animate-ping opacity-75" />
      )}

      {/* Header Geral */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAccessibility={() => setIsAccessPanelOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onSimulateIncomingMessage={handleSimulateIncomingMessage}
        activeAgent={activeAgent}
        webSocketStatus={webSocketStatus}
        unreadTotal={unreadTotal}
      />

      {/* Alternância entre Visualização Web Desktop e Simulador Android */}
      {viewMode === 'android' ? (
        <AndroidFrame onExitAndroidMode={() => setViewMode('desktop')}>
          {appCore}
        </AndroidFrame>
      ) : (
        appCore
      )}

      {/* Modal de Acessibilidade */}
      <AccessibilityPanel
        isOpen={isAccessPanelOpen}
        onClose={() => setIsAccessPanelOpen(false)}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        fontSize={fontSize}
        setFontSize={setFontSize}
        screenReaderActive={screenReaderActive}
        setScreenReaderActive={setScreenReaderActive}
        hearingAlertVisual={hearingAlertVisual}
        setHearingAlertVisual={setHearingAlertVisual}
        showSubtitles={showSubtitles}
        setShowSubtitles={setShowSubtitles}
      />

      {/* Modal de Suporte 24h */}
      <Support24hModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}
