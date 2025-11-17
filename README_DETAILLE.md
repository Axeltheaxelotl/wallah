# 📘 Matrix Workflow Builder - Documentation Complète

## 🎯 Vue d'ensemble

Un éditeur visuel de workflows pour automatiser des actions Matrix/Luxchat, façon n8n.

**Frontend (ce projet)** : Interface React qui génère du JSON
**Backend (à faire)** : Exécute le JSON via l'API Matrix

---

## 🏗️ Architecture Technique

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │  Palette   │  │   Canvas     │  │  Config Panel    │    │
│  │  (gauche)  │→ │  (ReactFlow) │→ │    (droite)      │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
│                           ↓                                  │
│                    Export JSON                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    workflow.json
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Python/Node)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Parser le JSON                                    │  │
│  │  2. Se connecter à Matrix                            │  │
│  │  3. Exécuter chaque node dans l'ordre                │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│                    API Matrix/Luxchat                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Structure des Fichiers

```
BISMILLAH/
├── src/
│   ├── components/
│   │   ├── WorkflowBuilder.tsx    # 🎛️ Composant principal
│   │   ├── CustomNode.tsx         # 🎨 Apparence des nodes
│   │   ├── NodePalette.tsx        # 📋 Liste des actions (gauche)
│   │   └── ConfigPanel.tsx        # ⚙️ Formulaires de config (droite)
│   ├── types/
│   │   └── workflow.ts            # 📝 Définitions TypeScript
│   ├── config/
│   │   └── nodeTypes.ts           # 🔧 Métadonnées des 7 types de nodes
│   ├── App.tsx                    # 🚀 Point d'entrée
│   ├── main.tsx                   # ⚡ Bootstrap React
│   └── index.css                  # 🎨 Styles globaux
├── package.json                    # 📦 Dépendances
└── README_DETAILLE.md             # 📘 Ce fichier
```

---

## 🧩 Composants Détaillés

### 1️⃣ WorkflowBuilder.tsx - Le Cerveau

**Responsabilité** : Orchestrer tout le workflow builder

#### **Variables d'État**
```typescript
const [nodes, setNodes] = useState([])        // Liste des nodes sur le canvas
const [edges, setEdges] = useState([])        // Connexions entre nodes
const [selectedNode, setSelectedNode] = useState(null)  // Node actuellement cliqué
const [workflowName, setWorkflowName] = useState('Mon workflow')
const [reactFlowInstance, setReactFlowInstance] = useState(null)
```

#### **Fonctions Principales**

##### `onConnect(params)`
**Quand** : L'utilisateur tire une ligne d'un node à un autre  
**Fait quoi** : Crée un edge (connexion) entre deux nodes  
**Code** :
```typescript
const onConnect = useCallback(
  (params: Connection) => setEdges((eds) => addEdge(params, eds)),
  [setEdges]
);
```

##### `onNodeClick(event, node)`
**Quand** : L'utilisateur clique sur un node  
**Fait quoi** : Enregistre le node sélectionné pour ouvrir le ConfigPanel  
**Code** :
```typescript
const onNodeClick = useCallback((_event, node) => {
  setSelectedNode(node);
}, []);
```

##### `onUpdateNodeConfig(nodeId, config)`
**Quand** : L'utilisateur modifie les paramètres dans le ConfigPanel  
**Fait quoi** : Met à jour la configuration du node  
**Code** :
```typescript
const onUpdateNodeConfig = useCallback((nodeId, config) => {
  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: { ...node.data, config }
        };
      }
      return node;
    })
  );
}, [setNodes]);
```

##### `onAddNode(type)`
**Quand** : L'utilisateur clique sur une action dans la palette  
**Fait quoi** : Crée un nouveau node sur le canvas  
**Code** :
```typescript
const onAddNode = useCallback((type) => {
  const metadata = getNodeMetadata(type);
  const newNode = {
    id: `${type}-${Date.now()}`,  // ID unique
    type,
    position: {
      x: Math.random() * 400 + 100,  // Position aléatoire
      y: Math.random() * 400 + 100
    },
    data: {
      label: metadata.label,
      config: {}  // Configuration vide au départ
    }
  };
  setNodes((nds) => [...nds, newNode]);
}, [setNodes]);
```

##### `onDragOver(event)`
**Quand** : L'utilisateur survole le canvas en trainant un node  
**Fait quoi** : Autorise le drop  
**Code** :
```typescript
const onDragOver = useCallback((event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}, []);
```

##### `onDrop(event)`
**Quand** : L'utilisateur lâche un node sur le canvas  
**Fait quoi** : Crée le node à l'endroit exact du drop  
**Code** :
```typescript
const onDrop = useCallback((event) => {
  event.preventDefault();
  const type = event.dataTransfer.getData('application/reactflow');
  const position = reactFlowInstance.project({
    x: event.clientX - reactFlowBounds.left,
    y: event.clientY - reactFlowBounds.top
  });
  // Créer le node à cette position
}, [reactFlowInstance, setNodes]);
```

##### `onExport()`
**Quand** : L'utilisateur clique sur "Exporter"  
**Fait quoi** : Télécharge le workflow en JSON  
**Code** :
```typescript
const onExport = useCallback(() => {
  const workflow = {
    id: `workflow-${Date.now()}`,
    name: workflowName,
    nodes: nodes,
    edges: edges,
    createdAt: new Date().toISOString()
  };
  
  const jsonString = JSON.stringify(workflow, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${workflowName}.json`;
  link.click();
}, [nodes, edges, workflowName]);
```

##### `onImport()`
**Quand** : L'utilisateur clique sur "Importer"  
**Fait quoi** : Charge un workflow depuis un fichier JSON  
**Code** :
```typescript
const onImport = useCallback(() => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const workflow = JSON.parse(event.target.result);
      setWorkflowName(workflow.name);
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
    };
    
    reader.readAsText(file);
  };
  
  input.click();
}, [setNodes, setEdges]);
```

---

### 2️⃣ CustomNode.tsx - L'Apparence des Nodes

**Responsabilité** : Afficher un node sur le canvas avec son icône et son label

#### Structure d'un Node
```typescript
interface NodeProps {
  data: {
    label: string;      // "Create Room", "Send Message", etc.
    config: object;     // Configuration (rempli ou vide)
  };
  type: string;         // 'createRoom', 'sendMessage', etc.
}
```

#### Rendu
```jsx
<div className="node-container">
  <Handle type="target" position={Position.Top} />  {/* Point de connexion en haut */}
  
  <div className="node-content">
    <Icon />  {/* Icône selon le type */}
    <div>{data.label}</div>
    {Object.keys(config).length > 0 && <span>Configuré ✓</span>}
  </div>
  
  <Handle type="source" position={Position.Bottom} />  {/* Point de connexion en bas */}
</div>
```

---

### 3️⃣ NodePalette.tsx - Menu des Actions

**Responsabilité** : Afficher la liste des 7 actions Matrix disponibles

#### Fonctionnement du Drag & Drop
```typescript
<div
  draggable
  onDragStart={(event) => {
    // On stocke le type de node dans le dataTransfer
    event.dataTransfer.setData('application/reactflow', nodeType.type);
    event.dataTransfer.effectAllowed = 'move';
  }}
  onClick={() => onAddNode(nodeType.type)}  // Alternative au drag & drop
>
  <Icon />
  <div>{nodeType.label}</div>
</div>
```

---

### 4️⃣ ConfigPanel.tsx - Formulaires de Configuration

**Responsabilité** : Afficher les champs de configuration selon le type de node

#### Logique Conditionnelle
```typescript
const renderConfigFields = () => {
  switch (selectedNode.type) {
    case 'createRoom':
      return (
        <div>
          <input name="roomName" placeholder="Nom du salon" />
          <select name="visibility">
            <option value="private">Privé</option>
            <option value="public">Public</option>
          </select>
          <textarea name="members" placeholder="@user1:matrix.org" />
        </div>
      );
    
    case 'sendMessage':
      return (
        <div>
          <textarea name="message" placeholder="Votre message" />
          <select name="format">
            <option value="plain">Texte simple</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>
      );
    
    // ... autres cas
  }
};
```

#### Mise à Jour
```typescript
const handleChange = (key, value) => {
  const newConfig = { ...config, [key]: value };
  setConfig(newConfig);
  onUpdate(selectedNode.id, newConfig);  // Remonte au WorkflowBuilder
};
```

---

## 📊 Types de Nodes Disponibles

### 1. 🔵 Create Room
**Objectif** : Créer un nouveau salon Matrix

**Configuration** :
```json
{
  "roomName": "Mon salon",
  "visibility": "private" | "public",
  "parentSpace": "!spaceId:matrix.org" (optionnel),
  "members": ["@user1:matrix.org", "@user2:matrix.org"]
}
```

**API Matrix correspondante** :
```python
response = await client.room_create(
    name=config['roomName'],
    visibility=config['visibility'],
    invite=config.get('members', [])
)
room_id = response.room_id
```

---

### 2. 🟢 Invite User
**Objectif** : Inviter un utilisateur dans un salon

**Configuration** :
```json
{
  "userId": "@user:matrix.org",
  "roomId": "!roomId:matrix.org"
}
```

**API Matrix** :
```python
await client.room_invite(
    room_id=config['roomId'],
    user_id=config['userId']
)
```

---

### 3. 🟣 Send Message
**Objectif** : Envoyer un message dans un salon

**Configuration** :
```json
{
  "message": "Contenu du message",
  "format": "plain" | "markdown" | "html",
  "targetRoom": "!roomId:matrix.org"
}
```

**API Matrix** :
```python
await client.room_send(
    room_id=config['targetRoom'],
    message_type="m.room.message",
    content={
        "msgtype": "m.text",
        "body": config['message'],
        "format": "org.matrix.custom.html" if config['format'] != 'plain' else None
    }
)
```

---

### 4. 🟡 Wait Time
**Objectif** : Attendre un délai avant la prochaine action

**Configuration** :
```json
{
  "duration": 30,
  "unit": "seconds" | "minutes" | "hours"
}
```

**API Backend** :
```python
import asyncio

duration_seconds = {
    'seconds': config['duration'],
    'minutes': config['duration'] * 60,
    'hours': config['duration'] * 3600
}[config['unit']]

await asyncio.sleep(duration_seconds)
```

---

### 5. 🟠 Analyse Stats
**Objectif** : Récupérer des statistiques d'un salon

**Configuration** :
```json
{
  "statsType": "roomActivity" | "userActivity" | "messageCount",
  "timeRange": "24h" | "7d" | "30d"
}
```

**API Matrix** :
```python
# Récupérer l'historique des messages
response = await client.room_messages(
    room_id=room_id,
    limit=1000
)

stats = {
    'message_count': len(response.chunk),
    'active_users': len(set([msg.sender for msg in response.chunk])),
    'period': config['timeRange']
}
```

---

### 6. 🔴 Destroy Room
**Objectif** : Supprimer un salon

**Configuration** :
```json
{
  "roomId": "!roomId:matrix.org"
}
```

**API Matrix** :
```python
# Attention : nécessite des permissions admin !
await client.room_forget(
    room_id=config['roomId']
)
```

---

### 7. 🟣 Webhook Trigger
**Objectif** : Appeler un webhook externe

**Configuration** :
```json
{
  "webhookUrl": "https://example.com/webhook",
  "method": "GET" | "POST",
  "headers": {"Authorization": "Bearer token"}
}
```

**API Backend** :
```python
import aiohttp

async with aiohttp.ClientSession() as session:
    async with session.request(
        method=config['method'],
        url=config['webhookUrl'],
        headers=config.get('headers', {})
    ) as response:
        return await response.json()
```

---

## 📤 Format du JSON Exporté

### Structure Complète
```json
{
  "id": "workflow-1731849600000",
  "name": "Onboarding automatique",
  "description": "Workflow Matrix créé avec le builder",
  "nodes": [
    {
      "id": "createRoom-1731849601234",
      "type": "createRoom",
      "position": { "x": 250, "y": 100 },
      "data": {
        "label": "Create Room",
        "config": {
          "roomName": "Bienvenue Team",
          "visibility": "private",
          "members": ["@alice:luxchat.lu", "@bob:luxchat.lu"]
        }
      }
    },
    {
      "id": "sendMessage-1731849602345",
      "type": "sendMessage",
      "position": { "x": 250, "y": 300 },
      "data": {
        "label": "Send Message",
        "config": {
          "message": "Bienvenue dans l'équipe ! 🎉",
          "format": "markdown",
          "targetRoom": "{{previousRoomId}}"
        }
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "createRoom-1731849601234",
      "target": "sendMessage-1731849602345"
    }
  ],
  "createdAt": "2025-11-17T14:00:00.000Z",
  "updatedAt": "2025-11-17T14:30:00.000Z"
}
```

---

## 🔧 Backend - Ce qu'il FAUT Implémenter

### Checklist Backend Minimal

#### 1. Parser le JSON ✅
```python
import json

with open('workflow.json', 'r') as f:
    workflow = json.load(f)

nodes = workflow['nodes']
edges = workflow['edges']
```

#### 2. Se Connecter à Matrix ✅
```python
from nio import AsyncClient

client = AsyncClient("https://luxchat.lu", "@bot:luxchat.lu")
await client.login("password_du_bot")
```

#### 3. Trouver l'Ordre d'Exécution ✅
```python
def find_execution_order(nodes, edges):
    """
    Retourne les nodes dans l'ordre d'exécution
    en suivant les edges
    """
    # 1. Trouver le node de départ (aucun edge entrant)
    node_ids = {node['id'] for node in nodes}
    target_ids = {edge['target'] for edge in edges}
    start_ids = node_ids - target_ids
    
    # 2. Suivre les edges pour construire l'ordre
    order = []
    visited = set()
    
    def traverse(node_id):
        if node_id in visited:
            return
        visited.add(node_id)
        order.append(node_id)
        
        # Trouver les enfants
        for edge in edges:
            if edge['source'] == node_id:
                traverse(edge['target'])
    
    for start_id in start_ids:
        traverse(start_id)
    
    return order
```

#### 4. Exécuter Chaque Node ✅
```python
async def execute_workflow(workflow_json):
    nodes_dict = {node['id']: node for node in workflow_json['nodes']}
    edges = workflow_json['edges']
    
    execution_order = find_execution_order(workflow_json['nodes'], edges)
    
    context = {}  # Pour passer des données entre nodes
    
    for node_id in execution_order:
        node = nodes_dict[node_id]
        config = node['data']['config']
        node_type = node['type']
        
        print(f"Exécution: {node_type} ({node_id})")
        
        if node_type == 'createRoom':
            response = await client.room_create(
                name=config['roomName'],
                visibility=config.get('visibility', 'private'),
                invite=config.get('members', [])
            )
            context['last_room_id'] = response.room_id
            print(f"✓ Room créé: {response.room_id}")
        
        elif node_type == 'sendMessage':
            room_id = config.get('targetRoom') or context.get('last_room_id')
            await client.room_send(
                room_id=room_id,
                message_type="m.room.message",
                content={
                    "msgtype": "m.text",
                    "body": config['message']
                }
            )
            print(f"✓ Message envoyé dans {room_id}")
        
        elif node_type == 'inviteUser':
            await client.room_invite(
                room_id=config['roomId'],
                user_id=config['userId']
            )
            print(f"✓ Invitation envoyée à {config['userId']}")
        
        elif node_type == 'waitTime':
            import asyncio
            duration = config['duration']
            unit = config['unit']
            
            seconds = {
                'seconds': duration,
                'minutes': duration * 60,
                'hours': duration * 3600
            }[unit]
            
            print(f"⏳ Attente de {duration} {unit}...")
            await asyncio.sleep(seconds)
            print(f"✓ Attente terminée")
        
        elif node_type == 'analyseStats':
            response = await client.room_messages(
                room_id=context.get('last_room_id'),
                limit=1000
            )
            stats = {
                'message_count': len(response.chunk),
                'users': len(set([msg.sender for msg in response.chunk]))
            }
            context['stats'] = stats
            print(f"✓ Stats: {stats}")
        
        elif node_type == 'destroyRoom':
            await client.room_forget(config['roomId'])
            print(f"✓ Room supprimé: {config['roomId']}")
        
        elif node_type == 'webhookTrigger':
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.request(
                    method=config['method'],
                    url=config['webhookUrl']
                ) as response:
                    result = await response.json()
                    print(f"✓ Webhook appelé: {result}")
    
    await client.close()
    return {"status": "success", "context": context}
```

---

## 🚀 Exemple Complet - Scénario d'Onboarding

### 1. Frontend - Créer le Workflow

**Actions** :
1. Drag "Create Room" sur le canvas
   - Configurer : roomName = "Bienvenue Alice"
   - Configurer : members = ["@alice:luxchat.lu"]

2. Drag "Send Message" en dessous
   - Configurer : message = "Bienvenue dans l'équipe !"

3. Connecter les deux nodes

4. Cliquer "Exporter" → `onboarding.json` téléchargé

### 2. JSON Généré
```json
{
  "id": "workflow-1731849600000",
  "name": "Onboarding Alice",
  "nodes": [
    {
      "id": "createRoom-1",
      "type": "createRoom",
      "data": {
        "config": {
          "roomName": "Bienvenue Alice",
          "members": ["@alice:luxchat.lu"]
        }
      }
    },
    {
      "id": "sendMessage-2",
      "type": "sendMessage",
      "data": {
        "config": {
          "message": "Bienvenue dans l'équipe !"
        }
      }
    }
  ],
  "edges": [
    {"source": "createRoom-1", "target": "sendMessage-2"}
  ]
}
```

### 3. Backend - Exécuter

```bash
python execute_workflow.py onboarding.json
```

**Output** :
```
Connexion à Luxchat...
✓ Connecté en tant que @bot:luxchat.lu

Exécution: createRoom (createRoom-1)
✓ Room créé: !abc123:luxchat.lu

Exécution: sendMessage (sendMessage-2)
✓ Message envoyé dans !abc123:luxchat.lu

Workflow terminé avec succès !
```

### 4. Résultat dans Luxchat

Alice reçoit :
- Une invitation dans le salon "Bienvenue Alice"
- Un message de bienvenue du bot

---

## 🎓 Comment Ça Marche - Flow Complet

### Scénario : Créer un workflow de A à Z

#### Étape 1 : Interface Vide
```
Frontend démarre → WorkflowBuilder affiche :
- Palette (gauche) avec 7 actions
- Canvas vide (centre)
- Aucun panneau de config (droite)
```

#### Étape 2 : Utilisateur Drag "Create Room"
```
1. NodePalette.onDragStart() 
   → stocke type='createRoom' dans dataTransfer

2. WorkflowBuilder.onDrop()
   → récupère type='createRoom'
   → calcule position (x, y) de la souris
   → crée newNode avec config vide
   → setNodes([...nodes, newNode])

3. Canvas → affiche CustomNode avec icône "Plus"
```

#### Étape 3 : Utilisateur Clique sur le Node
```
1. CustomNode → déclenche onClick

2. WorkflowBuilder.onNodeClick(node)
   → setSelectedNode(node)

3. ConfigPanel → s'affiche à droite
   → renderConfigFields() selon node.type
   → affiche formulaire "Create Room"
```

#### Étape 4 : Utilisateur Remplit la Config
```
1. ConfigPanel → input change
   → handleChange('roomName', 'Mon Salon')

2. ConfigPanel.onUpdate(nodeId, newConfig)
   → appelle WorkflowBuilder.onUpdateNodeConfig()

3. WorkflowBuilder.onUpdateNodeConfig()
   → setNodes(nodes.map(...)) pour mettre à jour le node

4. CustomNode → affiche maintenant "Configuré ✓"
```

#### Étape 5 : Utilisateur Ajoute un Deuxième Node
```
(Répète étapes 2-4 avec "Send Message")
```

#### Étape 6 : Utilisateur Connecte les Nodes
```
1. Utilisateur clique sur Handle (bottom) du premier node

2. Utilisateur tire vers Handle (top) du second node

3. ReactFlow.onConnect(connection)
   → WorkflowBuilder.onConnect()
   → setEdges([...edges, newEdge])

4. Canvas → affiche une ligne entre les nodes
```

#### Étape 7 : Utilisateur Exporte
```
1. Click "Exporter"
   → WorkflowBuilder.onExport()

2. Construit objet workflow avec nodes + edges

3. JSON.stringify(workflow)

4. Crée fichier blob

5. Déclenche téléchargement → mon-workflow.json
```

#### Étape 8 : Backend Exécute
```
1. Backend lit mon-workflow.json

2. Parse JSON → récupère nodes + edges

3. Trouve ordre d'exécution (via edges)

4. Pour chaque node :
   - Lit node.type
   - Lit node.data.config
   - Appelle API Matrix correspondante

5. Retourne résultat
```

---

## 🔍 Points Importants pour le Backend

### ⚠️ Gestion du Contexte Entre Nodes

**Problème** : Le deuxième node a besoin du `room_id` créé par le premier

**Solution** : Contexte partagé
```python
context = {
    'last_room_id': None,
    'last_message_id': None,
    'stats': {}
}

# Dans createRoom
context['last_room_id'] = response.room_id

# Dans sendMessage (si targetRoom non spécifié)
room_id = config.get('targetRoom') or context['last_room_id']
```

### ⚠️ Gestion des Erreurs

```python
try:
    if node_type == 'createRoom':
        response = await client.room_create(...)
except Exception as e:
    return {
        "status": "error",
        "node_id": node_id,
        "error": str(e)
    }
```

### ⚠️ Validation Avant Exécution

```python
def validate_workflow(workflow):
    """Vérifie que le workflow est valide avant exécution"""
    errors = []
    
    # Vérifier qu'il y a au moins un node
    if not workflow['nodes']:
        errors.append("Aucun node dans le workflow")
    
    # Vérifier les edges
    node_ids = {node['id'] for node in workflow['nodes']}
    for edge in workflow['edges']:
        if edge['source'] not in node_ids:
            errors.append(f"Edge source invalide: {edge['source']}")
        if edge['target'] not in node_ids:
            errors.append(f"Edge target invalide: {edge['target']}")
    
    # Vérifier les configs obligatoires
    for node in workflow['nodes']:
        config = node['data']['config']
        if node['type'] == 'createRoom' and not config.get('roomName'):
            errors.append(f"Node {node['id']}: roomName manquant")
    
    return errors
```

### ⚠️ Permissions Matrix

Certaines actions nécessitent des permissions spécifiques :

- `createRoom` → Besoin de pouvoir créer des rooms
- `destroyRoom` → Besoin d'être admin du room
- `inviteUser` → Besoin de pouvoir inviter dans le room

```python
# Vérifier les permissions avant d'exécuter
power_levels = await client.room_get_state_event(
    room_id, 'm.room.power_levels'
)

user_level = power_levels['users'].get(client.user_id, 0)
if user_level < 50:  # Besoin de niveau 50 pour inviter
    raise PermissionError("Pas assez de permissions")
```

---

## 🎯 Challenges du Hackathon - Comment On Les Résout

### 1. "Facilitate the creation and management of Matrix spaces"
✅ **Node "Create Room"** avec config visuelle (nom, visibilité, membres)

### 2. "Create rooms that self-destruct"
✅ **Workflow** : Create Room → Wait Time → Destroy Room

### 3. "Create bots to learn how to use Matrix"
✅ **Le workflow builder lui-même** = interface pédagogique pour apprendre Matrix

### 4. "Develop tools to analyse room activity"
✅ **Node "Analyse Stats"** pour récupérer statistiques

---

## 📝 TODO Liste pour l'Équipe

### Frontend (déjà fait ✅)
- [x] Interface ReactFlow
- [x] 7 types de nodes
- [x] Configuration via formulaires
- [x] Export/Import JSON

### Backend (à faire 🔨)
- [ ] Se connecter au serveur Luxchat du hackathon
- [ ] Parser le JSON du workflow
- [ ] Implémenter les 7 actions Matrix
- [ ] Gestion du contexte entre nodes
- [ ] Validation du workflow
- [ ] Gestion des erreurs
- [ ] API REST pour exécuter depuis le frontend

### Intégration (à faire 🔗)
- [ ] Bouton "Exécuter" qui appelle le backend
- [ ] Affichage des logs en temps réel
- [ ] Affichage des erreurs

### Pitch (à préparer 🎤)
- [ ] Slides PowerPoint
- [ ] Demo live
- [ ] Vidéo backup (2 min)

---

## 🎬 Prêt pour le Hackathon !

**Vous avez déjà 50% du travail fait avec ce frontend !**

Le reste c'est :
1. Backend Python/Node simple (1 jour de dev)
2. Tests avec Luxchat (quelques heures)
3. Préparation du pitch (1 heure)

**Bonne chance ! 🚀**
