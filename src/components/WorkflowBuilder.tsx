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
import { Download, Upload, Save, Play, Settings, Plus, Copy, BookTemplate } from 'lucide-react';

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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Palette de nodes */}
      <NodePalette onAddNode={onAddNode} />

      {/* Canvas principal */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar Premium */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 p-4 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left: Workflow Name */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <div>
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="text-2xl font-bold border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-3 py-1 transition-all"
                    placeholder="Mon workflow"
                  />
                  <div className="text-xs text-gray-500 px-3">Workflow Builder Matrix</div>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105"
              >
                <BookTemplate className="w-4 h-4" />
                <span className="font-medium">Templates</span>
              </button>

              <button
                onClick={onImport}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300"
              >
                <Upload className="w-4 h-4" />
                <span className="font-medium">Importer</span>
              </button>

              <button
                onClick={onExport}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300"
              >
                <Download className="w-4 h-4" />
                <span className="font-medium">Exporter</span>
              </button>

              {nodes.length > 0 && (
                <button
                  onClick={onDuplicate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300"
                >
                  <Copy className="w-4 h-4" />
                  <span className="font-medium">Dupliquer</span>
                </button>
              )}

              <button
                onClick={onSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105"
              >
                <Save className="w-4 h-4" />
                <span className="font-medium">Sauvegarder</span>
              </button>

              <button
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105"
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
            snapToGrid
            snapGrid={[20, 20]}
            defaultEdgeOptions={{
              animated: true,
              style: { 
                stroke: '#3b82f6',
                strokeWidth: 2.5,
              },
            }}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={24} 
              size={2}
              color="#cbd5e1"
              className="opacity-40"
            />
            <Controls 
              className="shadow-2xl !bg-white !border-gray-200 rounded-xl overflow-hidden"
              showInteractive={false}
            />
          </ReactFlow>

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center max-w-md animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Plus className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  Commencez votre workflow
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Glissez-déposez des actions depuis la palette de gauche<br/>
                  ou cliquez sur une action pour l'ajouter au canvas
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200 px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-medium">{nodes.length}</span>
                <span className="text-gray-500">actions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="font-medium">{edges.length}</span>
                <span className="text-gray-500">connexions</span>
              </div>
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Prêt pour le hackathon Matrix 🚀
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
