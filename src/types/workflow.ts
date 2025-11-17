// Types pour les différents types de nodes Matrix
export type MatrixNodeType = 
  | 'createRoom'
  | 'inviteUser'
  | 'sendMessage'
  | 'waitTime'
  | 'analyseStats'
  | 'destroyRoom'
  | 'webhookTrigger';

// Configuration pour chaque type de node
export interface NodeConfig {
  // Create Room
  roomName?: string;
  visibility?: 'public' | 'private';
  parentSpace?: string;
  members?: string[];
  
  // Send Message
  message?: string;
  format?: 'plain' | 'markdown' | 'html';
  targetRoom?: string;
  
  // Invite User
  userId?: string;
  roomId?: string;
  
  // Wait Time
  duration?: number;
  unit?: 'seconds' | 'minutes' | 'hours';
  
  // Analyse Stats
  statsType?: 'roomActivity' | 'userActivity' | 'messageCount';
  timeRange?: string;
  
  // Webhook Trigger
  webhookUrl?: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
}

// Node personnalisé avec sa config
export interface MatrixNode {
  id: string;
  type: MatrixNodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    config: NodeConfig;
  };
}

// Edge entre deux nodes
export interface MatrixEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

// Workflow complet
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: MatrixNode[];
  edges: MatrixEdge[];
  createdAt: string;
  updatedAt: string;
}

// Métadonnées des types de nodes
export interface NodeTypeMetadata {
  type: MatrixNodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
}
