import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import NodePalette from './NodePalette';
import ConfigPanel from './ConfigPanel';
import { TemplateGallery } from './TemplateGallery';
import { ImportModal } from './ImportModal';
import { MatrixNode, MatrixNodeType, NodeConfig, Workflow } from '../types/workflow';
import { getNodeMetadata } from '../config/nodeTypes';
import { Download, Upload, Save, Play, Settings, Plus, Copy, BookTemplate, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const nodeTypes: NodeTypes = {
  createRoom: CustomNode,
  inviteUser: CustomNode,
  sendMessage: CustomNode,
  waitTime: CustomNode,
  analyseStats: CustomNode,
  destroyRoom: CustomNode,
  webhookTrigger: CustomNode,
};

const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<MatrixNode | null>(null);
  const [workflowName, setWorkflowName] = useState('Mon workflow Matrix');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { isDark, toggle } = useDarkMode();

  // Connexion entre nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Sélection d'un node
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as MatrixNode);
  }, []);

  // Mise à jour de la config d'un node
  const onUpdateNodeConfig = useCallback(
    (nodeId: string, config: NodeConfig) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                config,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Ajout d'un nouveau node
  const onAddNode = useCallback(
    (type: MatrixNodeType) => {
      const metadata = getNodeMetadata(type);
      if (!metadata) return;

      const newNode: MatrixNode = {
        id: `${type}-${Date.now()}`,
        type,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data: {
          label: metadata.label,
          config: {},
        },
      };

      setNodes((nds) => [...nds, newNode as Node]);
    },
    [setNodes]
  );

  // Drag & Drop depuis la palette
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow') as MatrixNodeType;
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const metadata = getNodeMetadata(type);
      if (!metadata) return;

      const newNode: MatrixNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: metadata.label,
          config: {},
        },
      };

      setNodes((nds) => [...nds, newNode as Node]);
    },
    [reactFlowInstance, setNodes]
  );

  // Export du workflow en JSON
  const onExport = useCallback(() => {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: workflowName,
      description: 'Workflow Matrix créé avec le builder',
      nodes: nodes as MatrixNode[],
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${workflowName.replace(/\s+/g, '-').toLowerCase()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges, workflowName]);

  // Import d'un workflow depuis JSON
  const onImport = useCallback(() => {
    setShowImport(true);
  }, []);

  const onLoadWorkflow = useCallback((workflow: Workflow) => {
    setWorkflowName(workflow.name);
    setNodes(workflow.nodes as Node[]);
    setEdges(workflow.edges as Edge[]);
  }, [setNodes, setEdges]);

  // Dupliquer le workflow actuel
  const onDuplicate = useCallback(() => {
    const workflow = {
      name: `${workflowName} (Copie)`,
      nodes: nodes as MatrixNode[],
      edges: edges,
    };
    onLoadWorkflow(workflow as any);
  }, [nodes, edges, workflowName, onLoadWorkflow]);

  // Sauvegarder (pour l'instant juste un export)
  const onSave = useCallback(() => {
    onExport();
    alert('Workflow sauvegardé avec succès !');
  }, [onExport]);

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Palette de nodes */}
      <NodePalette onAddNode={onAddNode} isDark={isDark} />

      {/* Canvas principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar Premium */}
        <div className={`backdrop-blur-xl border-b p-4 shadow-lg flex-shrink-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between w-full gap-4">
            {/* Left: Workflow Name */}
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <div className="flex items-center gap-2 md:gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${isDark ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
                  <Settings className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                <div className="min-w-0">
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className={`text-lg md:text-2xl font-bold border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-2 md:px-3 py-1 ${isDark ? 'text-white' : 'text-gray-900'} w-full`}
                    placeholder="Mon workflow"
                  />
                  <div className={`text-xs px-2 md:px-3 hidden md:block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Workflow Builder Matrix</div>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <button
                onClick={toggle}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300 border-gray-600 hover:border-yellow-400' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'}`}
                title={isDark ? 'Mode clair' : 'Mode sombre'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-xl"
              >
                <BookTemplate className="w-4 h-4" />
                <span className="font-medium">Templates</span>
              </button>

              <button
                onClick={onImport}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg border-2 transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'}`}
              >
                <Upload className="w-4 h-4" />
                <span className="font-medium">Importer</span>
              </button>

              <button
                onClick={onExport}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg border-2 transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'}`}
              >
                <Download className="w-4 h-4" />
                <span className="font-medium">Exporter</span>
              </button>

              {nodes.length > 0 && (
                <button
                  onClick={onDuplicate}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg border-2 transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'}`}
                >
                  <Copy className="w-4 h-4" />
                  <span className="font-medium">Dupliquer</span>
                </button>
              )}

              <button
                onClick={onSave}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:shadow-xl transition-all ${isDark ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700' : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600'} text-white`}
              >
                <Save className="w-4 h-4" />
                <span className="font-medium">Sauvegarder</span>
              </button>

              <button
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-md hover:shadow-xl transition-all ${isDark ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700' : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'} text-white`}
                title="Exécuter le workflow (à implémenter)"
              >
                <Play className="w-5 h-5" />
                <span className="font-bold">Exécuter</span>
              </button>
            </div>
          </div>
        </div>

        {/* ReactFlow Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className={isDark ? 'dark' : ''}
            defaultEdgeOptions={{
              animated: true,
              style: { 
                stroke: isDark ? '#818cf8' : '#6366f1',
                strokeWidth: 2.5,
              },
            }}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={24} 
              size={2}
              color={isDark ? '#374151' : '#d1d5db'}
              className="opacity-40"
            />
            <Controls 
              className={`shadow-2xl rounded-xl overflow-hidden ${isDark ? '!bg-gray-800 !border-gray-700' : '!bg-white !border-gray-200'}`}
              showInteractive={false}
            />
          </ReactFlow>

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center max-w-md">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl ${isDark ? 'bg-gray-800 border-2 border-gray-700' : 'bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200'}`}>
                  <Plus className={`w-12 h-12 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Commencez votre workflow
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Glissez-déposez des actions depuis la palette de gauche<br/>
                  ou cliquez sur une action pour l'ajouter au canvas
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className={`backdrop-blur-xl border-t px-3 md:px-6 py-2 md:py-3 shadow-lg flex-shrink-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm">
              <div className={`flex items-center gap-1 md:gap-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`} />
                <span className="font-medium">{nodes.length}</span>
                <span className={`hidden sm:inline ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>actions</span>
              </div>
              <div className={`flex items-center gap-1 md:gap-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-purple-400' : 'bg-purple-500'}`} />
                <span className="font-medium">{edges.length}</span>
                <span className={`hidden sm:inline ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>connexions</span>
              </div>
            </div>
            <div className={`text-xs md:text-sm flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-teal-400' : 'bg-teal-500'}`} />
              <span className="hidden md:inline">Prêt pour le hackathon Matrix 🚀</span>
              <span className="md:hidden">🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau de configuration */}
      {selectedNode && (
        <ConfigPanel
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={onUpdateNodeConfig}
          isDark={isDark}
        />
      )}

      {/* Galerie de templates */}
      {showTemplates && (
        <TemplateGallery
          onClose={() => setShowTemplates(false)}
          onLoadTemplate={onLoadWorkflow}
        />
      )}

      {/* Modal d'import */}
      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImport={onLoadWorkflow}
        />
      )}
    </div>
  );
};

export default WorkflowBuilder;
