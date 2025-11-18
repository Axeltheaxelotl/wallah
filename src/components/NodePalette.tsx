import React from 'react';
import { NODE_TYPES } from '../config/nodeTypes';
import { 
  Plus, UserPlus, MessageSquare, Clock, 
  BarChart, Trash2, Webhook, GitBranch
} from 'lucide-react';
import { MatrixNodeType } from '../types/workflow';

const iconMap = {
  Plus, UserPlus, MessageSquare, Clock, 
  BarChart, Trash2, Webhook, GitBranch
};

interface NodePaletteProps {
  onAddNode: (type: MatrixNodeType) => void;
  isDark: boolean;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode, isDark }) => {
  return (
    <div className={`w-64 md:w-72 border-r shadow-2xl h-full overflow-y-auto flex-shrink-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className={`p-4 md:p-6 border-b sticky top-0 z-10 backdrop-blur-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg ${isDark ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
            <Plus className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <h2 className={`text-lg md:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Actions
          </h2>
        </div>
        <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          ✨ Glisser-déposer ou cliquer
        </p>
      </div>

      {/* Node Types */}
      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        {NODE_TYPES.map((nodeType) => {
          const IconComponent = iconMap[nodeType.icon as keyof typeof iconMap];
          
          return (
            <div
              key={nodeType.type}
              className="group relative"
            >
              <div
                className={`p-3 md:p-4 rounded-xl cursor-move border-2 transition-all ${isDark ? 'bg-gray-700 border-gray-600 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20' : 'bg-white border-gray-200 hover:border-indigo-400 hover:shadow-xl'}`}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', nodeType.type);
                  event.dataTransfer.effectAllowed = 'move';
                }}
                onClick={() => onAddNode(nodeType.type)}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  {/* Icon */}
                  <div className={`${nodeType.color} p-2 md:p-3 rounded-xl shadow-md flex-shrink-0`}>
                    <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-xs md:text-sm mb-1 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                      {nodeType.label}
                    </div>
                    <div className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {nodeType.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Tip */}
      <div className={`p-3 md:p-4 m-3 md:m-4 border-2 rounded-xl ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
        <div className="flex items-start gap-2">
          <div className={isDark ? 'text-indigo-400' : 'text-indigo-500'}>💡</div>
          <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-indigo-800'}`}>
            <strong>Astuce :</strong> Connectez les actions
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePalette;
