import { MatrixNodeType, NodeTypeMetadata } from '../types/workflow';

export const NODE_TYPES: NodeTypeMetadata[] = [
  {
    type: 'createRoom',
    label: 'Create Room',
    description: 'Créer un nouveau salon Matrix',
    icon: 'Plus',
    color: 'bg-blue-500'
  },
  {
    type: 'inviteUser',
    label: 'Invite User',
    description: 'Inviter un utilisateur dans un salon',
    icon: 'UserPlus',
    color: 'bg-green-500'
  },
  {
    type: 'sendMessage',
    label: 'Send Message',
    description: 'Envoyer un message dans un salon',
    icon: 'MessageSquare',
    color: 'bg-purple-500'
  },
  {
    type: 'waitTime',
    label: 'Wait Time',
    description: 'Attendre un certain temps',
    icon: 'Clock',
    color: 'bg-yellow-500'
  },
  {
    type: 'analyseStats',
    label: 'Analyse Stats',
    description: 'Analyser les statistiques',
    icon: 'BarChart',
    color: 'bg-orange-500'
  },
  {
    type: 'destroyRoom',
    label: 'Destroy Room',
    description: 'Supprimer un salon',
    icon: 'Trash2',
    color: 'bg-red-500'
  },
  {
    type: 'webhookTrigger',
    label: 'Webhook Trigger',
    description: 'Déclencher un webhook',
    icon: 'Webhook',
    color: 'bg-indigo-500'
  }
];

export const getNodeMetadata = (type: MatrixNodeType): NodeTypeMetadata | undefined => {
  return NODE_TYPES.find(node => node.type === type);
};
