import React from 'react';
import { NODE_TYPES } from '../config/nodeTypes';
import { 
  Plus, UserPlus, MessageSquare, Clock, 
  BarChart, Trash2, Webhook 
} from 'lucide-react';
import { MatrixNodeType } from '../types/workflow';

const iconMap = {
  Plus, UserPlus, MessageSquare, Clock, 
  BarChart, Trash2, Webhook
};

interface NodePaletteProps {
  onAddNode: (type: MatrixNodeType) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  return (
    <div className="w-72 bg-gradient-to-br from-slate-50 to-blue-50 border-r border-gray-200 shadow-2xl h-full overflow-y-auto animate-slide-in-left">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Actions Matrix
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          ✨ Glisser-déposer sur le canvas ou cliquer
        </p>
      </div>

      {/* Node Types */}
      <div className="p-4 space-y-3">
        {NODE_TYPES.map((nodeType, index) => {
          const IconComponent = iconMap[nodeType.icon as keyof typeof iconMap];
          
          return (
            <div
              key={nodeType.type}
              className="group relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`
                  p-4 rounded-xl cursor-move
                  bg-white border-2 border-gray-200
                  hover:border-blue-400 hover:shadow-xl
                  active:scale-95
                  transition-all duration-300 ease-out
                  transform hover:-translate-y-1
                `}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', nodeType.type);
                  event.dataTransfer.effectAllowed = 'move';
                }}
                onClick={() => onAddNode(nodeType.type)}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative flex items-start gap-3">
                  {/* Icon */}
                  <div className={`
                    ${nodeType.color} p-3 rounded-xl shadow-md
                    group-hover:shadow-lg group-hover:scale-110
                    transition-all duration-300
                  `}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 text-sm mb-1">
                      {nodeType.label}
                    </div>
                    <div className="text-xs text-gray-600 leading-relaxed">
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
      <div className="p-4 m-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <div className="flex items-start gap-2">
          <div className="text-blue-500 mt-0.5">💡</div>
          <div className="text-xs text-blue-800">
            <strong>Astuce :</strong> Connectez les actions en glissant depuis les points de connexion
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePalette;
