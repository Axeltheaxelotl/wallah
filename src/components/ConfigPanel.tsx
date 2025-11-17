import React from 'react';
import { X, Settings } from 'lucide-react';
import { MatrixNode, NodeConfig } from '../types/workflow';
import { FormInput, FormTextarea, FormSelect } from './FormInput';

interface ConfigPanelProps {
  selectedNode: MatrixNode | null;
  onClose: () => void;
  onUpdate: (nodeId: string, config: NodeConfig) => void;
  isDark: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ selectedNode, onClose, onUpdate, isDark }) => {
  if (!selectedNode) return null;

  const [config, setConfig] = React.useState<NodeConfig>(selectedNode.data.config || {});

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(selectedNode.id, newConfig);
  };

  const renderConfigFields = () => {
    const inputClass = `w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400'}`;
    const labelClass = `block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`;
    
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
              <label className={labelClass}>Parent Space <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>(optionnel)</span></label>
              <input
                type="text"
                value={config.parentSpace || ''}
                onChange={(e) => handleChange('parentSpace', e.target.value)}
                className={`${inputClass} focus:ring-blue-400`}
                placeholder="!spaceId:matrix.org"
              />
            </div>

            <div>
              <label className={labelClass}>Membres à ajouter <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>(un par ligne)</span></label>
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
            <div className={`border-2 rounded-2xl p-4 flex items-start gap-3 ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <div className={isDark ? 'text-red-400' : 'text-red-500'}>⚠️</div>
              <div>
                <p className={`font-semibold mb-1 ${isDark ? 'text-red-300' : 'text-red-800'}`}>Action irréversible</p>
                <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-700'}`}>Cette action supprimera définitivement le salon et toutes ses données.</p>
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
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-4xl mb-3">🤷</div>
            <p>Aucune configuration disponible</p>
          </div>
        );
    }
  };

  return (
    <div className={`w-80 md:w-96 border-l shadow-2xl h-full overflow-y-auto flex-shrink-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className={`sticky top-0 backdrop-blur-md border-b p-4 md:p-5 flex items-center justify-between z-10 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${isDark ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
            <Settings className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <h3 className={`text-lg md:text-xl font-bold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Configuration
          </h3>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-xl group transition-all ${isDark ? 'hover:bg-gray-700' : 'hover:bg-red-50'}`}
        >
          <X className={`w-5 h-5 transition-colors ${isDark ? 'text-gray-400 group-hover:text-red-400' : 'text-gray-600 group-hover:text-red-600'}`} />
        </button>
      </div>

      {/* Node Type Badge */}
      <div className="p-4 md:p-5">
        <div className={`rounded-xl md:rounded-2xl p-3 md:p-4 border-2 mb-4 md:mb-6 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'}`}>
          <div className={`text-xs md:text-sm font-medium mb-1 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Type d'action</div>
          <div className={`text-lg md:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            <span className="truncate">{selectedNode.data.label}</span>
            <div className={`w-2 h-2 rounded-full animate-pulse flex-shrink-0 ${isDark ? 'bg-teal-400' : 'bg-teal-500'}`} />
          </div>
        </div>

        {renderConfigFields()}
      </div>
    </div>
  );
};

export default ConfigPanel;
