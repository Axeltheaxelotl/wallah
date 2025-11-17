import React from 'react';
import { X, Settings, AlertTriangle } from 'lucide-react';
import { MatrixNode, NodeConfig } from '../types/workflow';
import { FormInput, FormTextarea, FormSelect } from './FormInput';

interface ConfigPanelProps {
  selectedNode: MatrixNode | null;
  onClose: () => void;
  onUpdate: (nodeId: string, config: NodeConfig) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ selectedNode, onClose, onUpdate }) => {
  if (!selectedNode) return null;

  const [config, setConfig] = React.useState<NodeConfig>(selectedNode.data.config || {});

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(selectedNode.id, newConfig);
  };

  const renderConfigFields = () => {
    const inputClass = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 transition-all duration-200 hover:border-gray-300 focus:outline-none focus:ring-2 placeholder-gray-400";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2";
    
    switch (selectedNode.type) {
      case 'createRoom':
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Nom du salon</label>
              <input
                type="text"
                value={config.roomName || ''}
                onChange={(e) => handleChange('roomName', e.target.value)}
                className={`${inputClass} focus:ring-blue-400 focus:border-blue-400`}
                placeholder="Mon salon Matrix"
              />
            </div>
            
            <div>
              <label className={labelClass}>Visibilité</label>
              <select
                value={config.visibility || 'private'}
                onChange={(e) => handleChange('visibility', e.target.value)}
                className={`${inputClass} focus:ring-blue-400 focus:border-blue-400 cursor-pointer`}
              >
                <option value="private">🔒 Privé</option>
                <option value="public">🌍 Public</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Parent Space <span className="text-gray-400 text-xs">(optionnel)</span></label>
              <input
                type="text"
                value={config.parentSpace || ''}
                onChange={(e) => handleChange('parentSpace', e.target.value)}
                className={`${inputClass} focus:ring-blue-400 focus:border-blue-400`}
                placeholder="!spaceId:matrix.org"
              />
            </div>

            <div>
              <label className={labelClass}>Membres à ajouter <span className="text-gray-400 text-xs">(un par ligne)</span></label>
              <textarea
                value={config.members?.join('\n') || ''}
                onChange={(e) => handleChange('members', e.target.value.split('\n').filter(Boolean))}
                className={`${inputClass} focus:ring-blue-400 focus:border-blue-400 resize-none`}
                rows={4}
                placeholder="@user1:matrix.org&#10;@user2:matrix.org"
              />
            </div>
          </div>
        );

      case 'sendMessage':
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Message</label>
              <textarea
                value={config.message || ''}
                onChange={(e) => handleChange('message', e.target.value)}
                className={`${inputClass} focus:ring-purple-400 focus:border-purple-400 resize-none`}
                rows={6}
                placeholder="Votre message ici..."
              />
            </div>

            <div>
              <label className={labelClass}>Format</label>
              <select
                value={config.format || 'plain'}
                onChange={(e) => handleChange('format', e.target.value)}
                className={`${inputClass} focus:ring-purple-400 focus:border-purple-400 cursor-pointer`}
              >
                <option value="plain">📝 Texte simple</option>
                <option value="markdown">✨ Markdown</option>
                <option value="html">🌐 HTML</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Salon cible</label>
              <input
                type="text"
                value={config.targetRoom || ''}
                onChange={(e) => handleChange('targetRoom', e.target.value)}
                className={`${inputClass} focus:ring-purple-400 focus:border-purple-400`}
                placeholder="!roomId:matrix.org"
              />
            </div>
          </div>
        );

      case 'inviteUser':
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>ID utilisateur</label>
              <input
                type="text"
                value={config.userId || ''}
                onChange={(e) => handleChange('userId', e.target.value)}
                className={`${inputClass} focus:ring-green-400 focus:border-green-400`}
                placeholder="@user:matrix.org"
              />
            </div>

            <div>
              <label className={labelClass}>ID du salon</label>
              <input
                type="text"
                value={config.roomId || ''}
                onChange={(e) => handleChange('roomId', e.target.value)}
                className={`${inputClass} focus:ring-green-400 focus:border-green-400`}
                placeholder="!roomId:matrix.org"
              />
            </div>
          </div>
        );

      case 'waitTime':
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Durée</label>
              <input
                type="number"
                value={config.duration || 0}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                className={`${inputClass} focus:ring-yellow-400 focus:border-yellow-400`}
                min="0"
              />
            </div>

            <div>
              <label className={labelClass}>Unité de temps</label>
              <select
                value={config.unit || 'seconds'}
                onChange={(e) => handleChange('unit', e.target.value)}
                className={`${inputClass} focus:ring-yellow-400 focus:border-yellow-400 cursor-pointer`}
              >
                <option value="seconds">⏱️ Secondes</option>
                <option value="minutes">⏰ Minutes</option>
                <option value="hours">🕐 Heures</option>
              </select>
            </div>
          </div>
        );

      case 'analyseStats':
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Type de statistique</label>
              <select
                value={config.statsType || 'roomActivity'}
                onChange={(e) => handleChange('statsType', e.target.value)}
                className={`${inputClass} focus:ring-orange-400 focus:border-orange-400 cursor-pointer`}
              >
                <option value="roomActivity">📊 Activité du salon</option>
                <option value="userActivity">👤 Activité utilisateur</option>
                <option value="messageCount">💬 Nombre de messages</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Période</label>
              <input
                type="text"
                value={config.timeRange || ''}
                onChange={(e) => handleChange('timeRange', e.target.value)}
                className={`${inputClass} focus:ring-orange-400 focus:border-orange-400`}
                placeholder="24h, 7d, 30d..."
              />
            </div>
          </div>
        );

      case 'destroyRoom':
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>ID du salon à supprimer</label>
              <input
                type="text"
                value={config.roomId || ''}
                onChange={(e) => handleChange('roomId', e.target.value)}
                className={`${inputClass} focus:ring-red-400 focus:border-red-400`}
                placeholder="!roomId:matrix.org"
              />
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="text-red-500 mt-0.5">⚠️</div>
              <div>
                <p className="font-semibold text-red-800 mb-1">Action irréversible</p>
                <p className="text-sm text-red-700">Cette action supprimera définitivement le salon et toutes ses données.</p>
              </div>
            </div>
          </div>
        );

      case 'webhookTrigger':
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>URL du webhook</label>
              <input
                type="url"
                value={config.webhookUrl || ''}
                onChange={(e) => handleChange('webhookUrl', e.target.value)}
                className={`${inputClass} focus:ring-indigo-400 focus:border-indigo-400`}
                placeholder="https://example.com/webhook"
              />
            </div>

            <div>
              <label className={labelClass}>Méthode HTTP</label>
              <select
                value={config.method || 'POST'}
                onChange={(e) => handleChange('method', e.target.value)}
                className={`${inputClass} focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-3">🤷</div>
            <p>Aucune configuration disponible</p>
          </div>
        );
    }
  };

  return (
    <div className="w-96 bg-gradient-to-br from-white to-gray-50 border-l border-gray-200 shadow-2xl h-full overflow-y-auto animate-slide-in-right">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 p-5 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Configuration
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-red-50 rounded-xl transition-all duration-200 group"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
        </button>
      </div>

      {/* Node Type Badge */}
      <div className="p-5">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200 mb-6">
          <div className="text-sm font-medium text-blue-600 mb-1">Type d'action</div>
          <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {selectedNode.data.label}
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>

        {renderConfigFields()}
      </div>
    </div>
  );
};

export default ConfigPanel;
