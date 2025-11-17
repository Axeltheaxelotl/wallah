# 📊 Utilisation de ReactFlow - Analyse Complète

## ✅ Ce Qu'on Utilise DÉJÀ

### Props de Base
```tsx
<ReactFlow
  // ✅ Nodes & Edges
  nodes={nodes}                    // Les cartes
  edges={edges}                    // Les connexions
  onNodesChange={onNodesChange}    // Quand tu bouges/sélectionnes
  onEdgesChange={onEdgesChange}    // Quand tu connectes
  
  // ✅ Custom Components
  nodeTypes={nodeTypes}            // Nos 7 types de nodes colorés
  
  // ✅ Event Handlers
  onConnect={onConnect}            // Quand tu connectes 2 nodes
  onNodeClick={onNodeClick}        // Quand tu cliques sur un node
  onInit={setReactFlowInstance}    // Quand ReactFlow est prêt
  onDrop={onDrop}                  // Drag & drop depuis la palette
  onDragOver={onDragOver}          // Pendant le drag
  
  // ✅ Viewport
  fitView                          // Auto-zoom pour voir tout
  snapToGrid                       // Aligner sur la grille
  snapGrid={[20, 20]}              // Grille de 20px
  
  // ✅ Styles
  defaultEdgeOptions={{
    animated: true,                // Flèches animées
    style: {
      stroke: '#3b82f6',          // Bleu
      strokeWidth: 2.5
    }
  }}
>
  <Background />                   // Points du fond
  <Controls />                     // Boutons zoom +/-
</ReactFlow>
```

---

## 🎨 Ce Qu'on PEUT Ajouter (Super Cool)

### 1. **MiniMap** - Carte Miniature

```tsx
import { MiniMap } from '@xyflow/react';

<ReactFlow {...props}>
  <Background />
  <Controls />
  <MiniMap 
    nodeStrokeColor={(n) => {
      if (n.type === 'createRoom') return '#3b82f6';
      if (n.type === 'sendMessage') return '#8b5cf6';
      return '#666';
    }}
    nodeColor={(n) => {
      if (n.data.config && Object.keys(n.data.config).length > 0) 
        return '#10b981';  // Vert si configuré
      return '#94a3b8';    // Gris sinon
    }}
    nodeBorderRadius={12}
    zoomable
    pannable
  />
</ReactFlow>
```

**Rendu :**
```
┌─────────────────────────┐
│                         │
│    Workflow Builder     │
│                         │
│  ┌───────────────┐      │
│  │ [MiniMap]     │      │
│  │  🔵 🟢        │      │
│  │     🟣        │      │
│  │       🟠      │      │
│  └───────────────┘      │
│                         │
└─────────────────────────┘
```

### 2. **Panel** - Bannière Infos

```tsx
import { Panel } from '@xyflow/react';

<ReactFlow {...props}>
  <Background />
  <Controls />
  
  {/* Panel en haut */}
  <Panel position="top-center">
    <div className="bg-white px-6 py-3 rounded-lg shadow-lg">
      <p className="text-sm text-gray-600">
        🎯 <strong>{nodes.length}</strong> actions • 
        ⚡ <strong>{edges.length}</strong> connexions
      </p>
    </div>
  </Panel>
  
  {/* Panel en bas */}
  <Panel position="bottom-left">
    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
      💾 Auto-sauvegardé il y a 2 min
    </div>
  </Panel>
</ReactFlow>
```

### 3. **NodeToolbar** - Menu Contextuel sur Node

```tsx
// Dans CustomNode.tsx
import { NodeToolbar, Position } from '@xyflow/react';

export function CustomNode({ data, id }) {
  return (
    <>
      <NodeToolbar
        isVisible={data.toolbarVisible}
        position={Position.Top}
        offset={10}
      >
        <button onClick={() => onDuplicate(id)}>
          📋 Dupliquer
        </button>
        <button onClick={() => onDelete(id)}>
          🗑️ Supprimer
        </button>
        <button onClick={() => onConfigure(id)}>
          ⚙️ Configurer
        </button>
      </NodeToolbar>
      
      <div className="node-content">
        {/* ... */}
      </div>
    </>
  );
}
```

**Rendu :**
```
    [📋 Dupliquer] [🗑️ Supprimer] [⚙️ Configurer]
              ↓
    ┌─────────────────┐
    │  🔵 Create Room │
    └─────────────────┘
```

### 4. **Interactions Avancées**

```tsx
<ReactFlow
  // Sélection Multiple
  selectionKeyCode="Shift"
  multiSelectionKeyCode="Control"
  
  // Zoom
  minZoom={0.1}           // Zoom arrière max
  maxZoom={4}             // Zoom avant max
  zoomOnDoubleClick={true}
  zoomOnScroll={true}
  zoomOnPinch={true}      // Pour mobile/touchpad
  
  // Pan (déplacement)
  panOnScroll={false}
  panOnDrag={true}
  panActivationKeyCode="Space"  // Maintenir Space pour pan
  
  // Auto-pan quand on drag près du bord
  autoPanOnConnect={true}
  autoPanOnNodeDrag={true}
  autoPanSpeed={15}
  
  // Connexions
  connectionMode="strict"  // ou "loose"
  connectOnClick={true}    // Clic sur handle puis clic sur target
  
  // Limites
  translateExtent={[[-1000, -1000], [1000, 1000]]}  // Limiter le pan
  nodeExtent={[[0, 0], [1000, 800]]}  // Limiter où on peut placer nodes
/>
```

### 5. **Edge Markers** - Flèches Personnalisées

```tsx
const defaultEdgeOptions = {
  animated: true,
  style: { 
    stroke: '#3b82f6',
    strokeWidth: 2.5 
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#3b82f6',
  },
  markerStart: {
    type: MarkerType.Arrow,
    width: 15,
    height: 15,
    color: '#f59e0b',
  }
};
```

**Rendu :**
```
[Node 1] ←──────────────→ [Node 2]
         Flèches des 2 côtés !
```

### 6. **onSelectionChange** - Sélection Multiple

```tsx
const onSelectionChange = ({ nodes, edges }) => {
  console.log('Nodes sélectionnés:', nodes.length);
  console.log('Edges sélectionnés:', edges.length);
  
  // Afficher une barre d'actions
  if (nodes.length > 1) {
    setShowBulkActions(true);
  }
};

<ReactFlow
  onSelectionChange={onSelectionChange}
  selectionOnDrag={false}  // Shift+Drag pour sélectionner
/>
```

### 7. **Hooks Avancés**

```tsx
import { 
  useReactFlow, 
  useViewport,
  useKeyPress,
  useOnSelectionChange 
} from '@xyflow/react';

function FlowControls() {
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();
  const { x, y, zoom } = useViewport();
  const deletePressed = useKeyPress('Delete');
  
  // Auto-delete quand on appuie sur Delete
  useEffect(() => {
    if (deletePressed) {
      deleteSelectedElements();
    }
  }, [deletePressed]);
  
  return (
    <Panel position="bottom-right">
      <button onClick={() => fitView()}>🎯 Fit View</button>
      <button onClick={() => zoomIn()}>🔍+ Zoom In</button>
      <button onClick={() => zoomOut()}>🔍- Zoom Out</button>
      <div>Zoom: {Math.round(zoom * 100)}%</div>
    </Panel>
  );
}
```

### 8. **Edge Labels** - Labels sur les Flèches

```tsx
const edges = [
  {
    id: 'e1',
    source: 'create-1',
    target: 'msg-1',
    label: 'puis',  // ← Label visible !
    labelStyle: { 
      fill: '#3b82f6', 
      fontWeight: 700 
    },
    labelBgStyle: { 
      fill: 'white', 
      fillOpacity: 0.9 
    }
  }
];
```

**Rendu :**
```
[Create Room]
      │
      │ puis
      ↓
[Send Message]
```

### 9. **Node Resizer** - Nodes Redimensionnables

```tsx
import { NodeResizer } from '@xyflow/react';

function CustomNode({ selected }) {
  return (
    <>
      <NodeResizer 
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        handleStyle={{ background: '#3b82f6' }}
      />
      <div className="node-content">
        {/* ... */}
      </div>
    </>
  );
}
```

### 10. **Différents Types de Connexions**

```tsx
import { ConnectionLineType } from '@xyflow/react';

<ReactFlow
  connectionLineType={ConnectionLineType.SmoothStep}
  // Options: Bezier, SmoothStep, Step, Straight, SimpleBezier
/>
```

**Visuels :**
```
Bezier:      [A] ╭─────╮ [B]
                 │     │

SmoothStep:  [A] ┐     ┌ [B]
                 └─────┘

Step:        [A] ┐
                 │
                 └───── [B]

Straight:    [A] ────── [B]
```

---

## 🚀 Améliorations à Implémenter MAINTENANT

### Proposition 1 : Ajouter MiniMap + Panel

```tsx
// WorkflowBuilder.tsx
import { MiniMap, Panel } from '@xyflow/react';

<ReactFlow {...props}>
  <Background />
  <Controls />
  
  {/* MiniMap en bas à droite */}
  <MiniMap 
    nodeStrokeColor="#666"
    nodeColor={(n) => {
      const colors = {
        createRoom: '#3b82f6',
        inviteUser: '#10b981',
        sendMessage: '#8b5cf6',
        waitTime: '#f59e0b',
        analyseStats: '#ec4899',
        destroyRoom: '#ef4444',
        webhookTrigger: '#6366f1'
      };
      return colors[n.type] || '#94a3b8';
    }}
    nodeBorderRadius={8}
    zoomable
    pannable
    className="!bg-gray-50 !border-2 !border-gray-200 !rounded-xl"
  />
  
  {/* Panel d'infos en haut */}
  <Panel position="top-center">
    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg border-2 border-gray-200">
      <div className="flex items-center gap-6 text-sm">
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <strong>{nodes.length}</strong> actions
        </span>
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
          <strong>{edges.length}</strong> connexions
        </span>
        <span className="text-gray-500">
          {workflowName}
        </span>
      </div>
    </div>
  </Panel>
</ReactFlow>
```

### Proposition 2 : Ajouter Keyboard Shortcuts

```tsx
<ReactFlow
  // Supprimer avec Delete ou Backspace
  deleteKeyCode={['Delete', 'Backspace']}
  
  // Sélection multiple avec Shift
  selectionKeyCode="Shift"
  
  // Sélection additionnelle avec Ctrl/Cmd
  multiSelectionKeyCode={null}  // Désactivé
  
  // Pan avec Space
  panActivationKeyCode="Space"
  
  // Zoom avec Ctrl/Cmd
  zoomActivationKeyCode={null}
/>
```

### Proposition 3 : Améliorer les Edges

```tsx
import { MarkerType } from '@xyflow/react';

const defaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',  // ← Connexions en escalier smooth
  style: { 
    stroke: '#3b82f6',
    strokeWidth: 2.5 
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 25,
    height: 25,
    color: '#3b82f6',
  }
};
```

---

## 💡 Recommandations pour le Hackathon

### Must-Have (Ajout Rapide - 30min)
1. ✅ **MiniMap** - Super visuel pour la démo
2. ✅ **Panel Top** - Montrer les stats en temps réel
3. ✅ **Edge Type SmoothStep** - Plus joli que Bezier

### Nice-to-Have (Si temps - 1h)
4. ⭐ **NodeToolbar** - Menu contextuel stylé
5. ⭐ **Better Zoom Limits** - minZoom/maxZoom
6. ⭐ **Edge Labels** - "puis", "après", "si"

### Advanced (Post-Hackathon)
7. 🚀 **Node Resizer** - Nodes redimensionnables
8. 🚀 **Custom Connection Lines** - Lignes colorées par type
9. 🚀 **Undo/Redo** - Historique des actions

---

## 🎯 Tu veux que j'ajoute quoi maintenant ?

A. **MiniMap + Panel** (30min) - Pour rendre la démo WOW
B. **NodeToolbar** (1h) - Menu contextuel sur chaque node
C. **Tout à la fois** (2h) - Version complète ultime
D. **Autre chose** - Dis-moi !

Qu'est-ce qui te tente le plus ? 😎
