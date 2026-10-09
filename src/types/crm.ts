export type ChannelType = 'whatsapp' | 'instagram' | 'facebook';

export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved';

export interface Message {
  id: string;
  sender: 'contact' | 'agent' | 'bot';
  text: string;
  timestamp: string;
  channel: ChannelType;
  status: 'sent' | 'delivered' | 'read';
  isAudio?: boolean;
  audioDuration?: string;
  audioTranscription?: string; // Legenda dinâmica / acessibilidade
  hasAttachments?: boolean;
  attachmentName?: string;
  attachmentType?: 'image' | 'document' | 'pdf';
  encrypted?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  channel: ChannelType;
  handle?: string; // ex: @lojadourada
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: TicketStatus;
  assignedAgentId: string;
  tags: string[];
  notes?: string;
  e2eeFingerprint: string; // Chave de Criptografia LGPD
  lgpdConsentGiven: boolean;
  lgpdConsentDate: string;
  anonymized?: boolean;
}

export interface Appointment {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  channel: ChannelType;
  service: string;
  agentId: string;
  agentName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  status: 'confirmed' | 'pending' | 'completed' | 'canceled';
  notes?: string;
  reminderSent: boolean;
}

export interface AgentUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Supervisor' | 'Atendente';
  avatar: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  department: 'Vendas' | 'Suporte Técnico' | 'Agendamentos' | 'Geral';
  openTickets: number;
  rating: number; // 4.8 / 5.0
}

export interface QuickReply {
  id: string;
  shortcut: string;
  title: string;
  message: string;
  category: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  targetContact: string;
  legalBasis: string; // ex: Art. 7º V - Execução de contrato (LGPD)
  ipAddress: string;
}

export interface ChannelIntegration {
  id: ChannelType;
  name: string;
  icon: string;
  connected: boolean;
  accountName: string;
  accountId: string;
  webhookStatus: 'operational' | 'degraded' | 'offline';
  latencyMs: number;
  messagesToday: number;
  lastSync: string;
  oauthScope: string[];
}
