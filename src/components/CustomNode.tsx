import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Plus, UserPlus, MessageSquare, Clock, 
  BarChart, Trash2, Webhook, Check, GitBranch
} from 'lucide-react';
import { MatrixNodeType } from '../types/workflow';

const iconMap = {
  createRoom: Plus,
  inviteUser: UserPlus,
  sendMessage: MessageSquare,
  waitTime: Clock,
  analyseStats: BarChart,
  destroyRoom: Trash2,
  webhookTrigger: Webhook,
  split: GitBranch,
};

const gradientMap = {
  createRoom: 'from-blue-500 via-blue-600 to-blue-700',
  inviteUser: 'from-emerald-500 via-emerald-600 to-emerald-700',
  sendMessage: 'from-purple-500 via-purple-600 to-purple-700',
  waitTime: 'from-amber-500 via-amber-600 to-amber-700',
  analyseStats: 'from-pink-500 via-pink-600 to-pink-700',
  destroyRoom: 'from-red-500 via-red-600 to-red-700',
  webhookTrigger: 'from-indigo-500 via-indigo-600 to-indigo-700',
  split: 'from-cyan-500 via-cyan-600 to-cyan-700',
};

interface CustomNodeData {
  label: string;
  config: Record<string, any>;
}

const CustomNode = ({ data, type }: NodeProps<CustomNodeData>) => {
  const nodeType = type as MatrixNodeType;
  const Icon = iconMap[nodeType];
  const gradient = gradientMap[nodeType];
  const isConfigured = data.config && Object.keys(data.config).length > 0;

  return (
    <div className="relative group">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-3 !h-3 !bg-white !border-2 !border-gray-400"
      />
      
      {/* Card avec effet glassmorphism */}
      <div className={`
        relative overflow-hidden
        min-w-[240px] rounded-2xl
        bg-gradient-to-br ${gradient}
        shadow-xl
        border-2 border-white/30
      `}>
        
        {/* Effet de brillance subtil */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Pattern de fond décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 3px 3px, white 1.5px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        {/* Contenu principal */}
        <div className="relative px-4 py-4">
          {/* Header avec icône */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6 text-white drop-shadow-md" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-base truncate drop-shadow-md">
                {data.label}
              </div>
              <div className="text-xs text-white/90 font-medium mt-0.5">
                {nodeType.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          </div>
          
          {/* Badge de configuration */}
          {isConfigured && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/30 backdrop-blur-sm border border-white/40">
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              <span className="text-xs font-semibold text-white">Configured</span>
            </div>
          )}
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-3 !h-3 !bg-white !border-2 !border-gray-400"
      />
    </div>
  );
};

export default memo(CustomNode);
