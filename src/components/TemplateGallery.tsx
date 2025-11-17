import { X, Zap, Users, Clock } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  workflow: any;
}

interface TemplateGalleryProps {
  onClose: () => void;
  onLoadTemplate: (workflow: any) => void;
}

const templates: Template[] = [
  {
    id: 'onboarding',
    name: 'Onboarding Automatique',
    description: 'Crée un salon, envoie un message de bienvenue et analyse les stats',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    workflow: {
      name: 'Onboarding Automatique',
      nodes: [
        {
          id: 'create-1',
          type: 'createRoom',
          position: { x: 250, y: 50 },
          data: {
            label: 'Créer Salon Bienvenue',
            type: 'createRoom',
            config: {
              roomName: 'Bienvenue 👋',
              visibility: 'private',
              members: []
            }
          }
        },
        {
          id: 'msg-1',
          type: 'sendMessage',
          position: { x: 250, y: 180 },
          data: {
            label: 'Message Bienvenue',
            type: 'sendMessage',
            config: {
              message: '🎉 Bienvenue dans notre communauté !\n\nNous sommes ravis de vous accueillir.',
              format: 'markdown'
            }
          }
        },
        {
          id: 'wait-1',
          type: 'waitTime',
          position: { x: 250, y: 310 },
          data: {
            label: 'Attendre 5s',
            type: 'waitTime',
            config: {
              duration: 5,
              unit: 'seconds'
            }
          }
        },
        {
          id: 'stats-1',
          type: 'analyseStats',
          position: { x: 250, y: 440 },
          data: {
            label: 'Analyser Stats',
            type: 'analyseStats',
            config: {
              statsType: 'room',
              timeRange: '24h'
            }
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'create-1', target: 'msg-1' },
        { id: 'e2', source: 'msg-1', target: 'wait-1' },
        { id: 'e3', source: 'wait-1', target: 'stats-1' }
      ]
    }
  },
  {
    id: 'temp-room',
    name: 'Salon Temporaire',
    description: 'Crée un salon qui s\'auto-détruit après 1 heure',
    icon: Clock,
    color: 'from-orange-500 to-orange-600',
    workflow: {
      name: 'Salon Temporaire',
      nodes: [
        {
          id: 'create-1',
          type: 'createRoom',
          position: { x: 250, y: 50 },
          data: {
            label: 'Créer Salon Temporaire',
            type: 'createRoom',
            config: {
              roomName: '⏰ Salon Temporaire',
              visibility: 'private',
              members: []
            }
          }
        },
        {
          id: 'msg-1',
          type: 'sendMessage',
          position: { x: 250, y: 180 },
          data: {
            label: 'Avertissement',
            type: 'sendMessage',
            config: {
              message: '⚠️ Ce salon sera supprimé dans 1 heure.',
              format: 'plain'
            }
          }
        },
        {
          id: 'wait-1',
          type: 'waitTime',
          position: { x: 250, y: 310 },
          data: {
            label: 'Attendre 1h',
            type: 'waitTime',
            config: {
              duration: 1,
              unit: 'hours'
            }
          }
        },
        {
          id: 'destroy-1',
          type: 'destroyRoom',
          position: { x: 250, y: 440 },
          data: {
            label: 'Supprimer Salon',
            type: 'destroyRoom',
            config: {}
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'create-1', target: 'msg-1' },
        { id: 'e2', source: 'msg-1', target: 'wait-1' },
        { id: 'e3', source: 'wait-1', target: 'destroy-1' }
      ]
    }
  },
  {
    id: 'webhook',
    name: 'Notification Webhook',
    description: 'Déclenche un webhook et crée un salon pour les notifications',
    icon: Zap,
    color: 'from-purple-500 to-purple-600',
    workflow: {
      name: 'Notification Webhook',
      nodes: [
        {
          id: 'webhook-1',
          type: 'webhookTrigger',
          position: { x: 250, y: 50 },
          data: {
            label: 'Webhook Trigger',
            type: 'webhookTrigger',
            config: {
              webhookUrl: 'https://your-webhook.com/trigger',
              method: 'POST'
            }
          }
        },
        {
          id: 'create-1',
          type: 'createRoom',
          position: { x: 250, y: 180 },
          data: {
            label: 'Créer Salon Notifs',
            type: 'createRoom',
            config: {
              roomName: '🔔 Notifications',
              visibility: 'private'
            }
          }
        },
        {
          id: 'msg-1',
          type: 'sendMessage',
          position: { x: 250, y: 310 },
          data: {
            label: 'Envoyer Notification',
            type: 'sendMessage',
            config: {
              message: '🚨 Nouvelle alerte webhook reçue !',
              format: 'markdown'
            }
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'webhook-1', target: 'create-1' },
        { id: 'e2', source: 'create-1', target: 'msg-1' }
      ]
    }
  },
  {
    id: 'invite-blast',
    name: 'Invitation en Masse',
    description: 'Crée un salon et invite plusieurs utilisateurs',
    icon: Users,
    color: 'from-green-500 to-green-600',
    workflow: {
      name: 'Invitation en Masse',
      nodes: [
        {
          id: 'create-1',
          type: 'createRoom',
          position: { x: 250, y: 50 },
          data: {
            label: 'Créer Salon Équipe',
            type: 'createRoom',
            config: {
              roomName: '👥 Salon Équipe',
              visibility: 'private'
            }
          }
        },
        {
          id: 'invite-1',
          type: 'inviteUser',
          position: { x: 150, y: 200 },
          data: {
            label: 'Inviter User 1',
            type: 'inviteUser',
            config: {
              userId: '@user1:luxchat.lu'
            }
          }
        },
        {
          id: 'invite-2',
          type: 'inviteUser',
          position: { x: 350, y: 200 },
          data: {
            label: 'Inviter User 2',
            type: 'inviteUser',
            config: {
              userId: '@user2:luxchat.lu'
            }
          }
        },
        {
          id: 'msg-1',
          type: 'sendMessage',
          position: { x: 250, y: 350 },
          data: {
            label: 'Message Équipe',
            type: 'sendMessage',
            config: {
              message: '👋 Bienvenue à toute l\'équipe !',
              format: 'plain'
            }
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'create-1', target: 'invite-1' },
        { id: 'e2', source: 'create-1', target: 'invite-2' },
        { id: 'e3', source: 'invite-1', target: 'msg-1' },
        { id: 'e4', source: 'invite-2', target: 'msg-1' }
      ]
    }
  }
];

export function TemplateGallery({ onClose, onLoadTemplate }: TemplateGalleryProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              📚 Galerie de Templates
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Choisissez un modèle prêt à l'emploi pour démarrer rapidement
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    onLoadTemplate(template.workflow);
                    onClose();
                  }}
                  className="group relative text-left p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-xl bg-white overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {template.workflow.nodes.length} actions
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Prêt à l'emploi
                      </span>
                    </div>

                    {/* Hover indicator */}
                    <div className="mt-3 text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Cliquer pour utiliser →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>Astuce :</strong> Vous pouvez personnaliser chaque template après l'avoir chargé
          </p>
        </div>
      </div>
    </div>
  );
}
