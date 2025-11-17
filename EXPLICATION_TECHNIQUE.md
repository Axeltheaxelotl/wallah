# 🎓 Explication Technique Complète du Workflow Builder

## 📋 Table des Matières
1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture du Projet](#architecture)
3. [Comment Ça Marche - Frontend](#frontend)
4. [Comment Ça Marche - Backend](#backend)
5. [Flow de Données](#flow)
6. [Chaque Composant Expliqué](#composants)
7. [Les 7 Actions Matrix](#actions)

---

## 🎯 Vue d'Ensemble

### C'est Quoi Ce Projet ?

**En une phrase :** Un éditeur visuel pour créer des automatisations Matrix, comme n8n mais pour Luxchat.

**Analogie cuisine :**
```
┌─────────────────────────────────────────┐
│  Tu es le CHEF                          │
│  Les ACTIONS sont des ingrédients       │
│  Le WORKFLOW est ta recette             │
│  L'EXÉCUTION est la cuisson             │
└─────────────────────────────────────────┘
```

### Les 3 Parties du Projet

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  1. FRONTEND (React) - Ce que tu as créé        │
│     → Interface visuelle                         │
│     → Glisser-déposer des actions               │
│     → Export en JSON                             │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  2. BACKEND (Python) - À faire par Timo         │
│     → Lit le JSON                                │
│     → Se connecte à Luxchat                      │
│     → Exécute les actions                        │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  3. LUXCHAT (Serveur Matrix)                    │
│     → Reçoit les commandes                       │
│     → Crée les salons                            │
│     → Envoie les messages                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture du Projet

### Structure des Fichiers

```
BISMILLAH/
│
├── src/
│   ├── components/           # Les composants React
│   │   ├── WorkflowBuilder.tsx    ← CHEF D'ORCHESTRE
│   │   ├── CustomNode.tsx         ← Les cartes colorées
│   │   ├── NodePalette.tsx        ← Menu de gauche
│   │   ├── ConfigPanel.tsx        ← Menu de droite
│   │   ├── TemplateGallery.tsx    ← Galerie de modèles
│   │   └── ImportModal.tsx        ← Fenêtre d'import
│   │
│   ├── types/
│   │   └── workflow.ts       # Définitions TypeScript
│   │
│   ├── config/
│   │   └── nodeTypes.ts      # Métadonnées des 7 actions
│   │
│   └── App.tsx               # Point d'entrée
│
├── workflows/                # Exemples JSON
│   ├── exemple_onboarding.json
│   └── exemple_room_temporaire.json
│
└── Documentation/
    ├── README.md
    ├── README_DETAILLE.md
    ├── BACKEND_IMPLEMENTATION.md
    ├── GUIDE_PARTAGE.md
    └── EXPLICATION_TECHNIQUE.md  ← Tu es ici !
```

---

## 🎨 Comment Ça Marche - FRONTEND

### Étape 1 : L'Utilisateur Ouvre l'Application

```
Navigateur → http://localhost:3002
   ↓
App.tsx charge
   ↓
WorkflowBuilder.tsx s'affiche
   ↓
Trois panneaux apparaissent :
   - Gauche  : NodePalette (actions disponibles)
   - Centre  : ReactFlow (canvas blanc)
   - Droite  : ConfigPanel (fermé au début)
```

### Étape 2 : Glisser-Déposer une Action

**Qu'est-ce qui se passe quand tu glisses "Create Room" ?**

```javascript
// 1. Tu cliques sur "Create Room" dans NodePalette
NodePalette.tsx
  onDragStart={(e) => {
    e.dataTransfer.setData('nodeType', 'createRoom');
    // ↑ On "colle" l'info sur ce que tu glisses
  }}

// 2. Tu survoles le canvas
WorkflowBuilder.tsx
  onDragOver={(e) => {
    e.preventDefault(); // Autorise le drop
  }}

// 3. Tu lâches la souris sur le canvas
WorkflowBuilder.tsx
  onDrop={(e) => {
    const type = e.dataTransfer.getData('nodeType'); // 'createRoom'
    const position = reactFlowInstance.project({
      x: e.clientX,  // Position X de ta souris
      y: e.clientY   // Position Y de ta souris
    });

    // 4. On crée un nouveau node
    const newNode = {
      id: `${type}-${Date.now()}`,  // ID unique
      type: type,                    // 'createRoom'
      position: position,            // {x: 250, y: 100}
      data: {
        label: 'Create Room',
        type: type,
        config: {}  // Vide au début
      }
    };

    // 5. On l'ajoute au canvas
    setNodes((prevNodes) => [...prevNodes, newNode]);
  }}
```

**Résultat visuel :**
```
Avant :                    Après :
┌──────────┐              ┌──────────┐
│  Canvas  │              │  Canvas  │
│   vide   │              │          │
│          │              │  [🔵]    │ ← Ta nouvelle carte
│          │              │ Create   │
└──────────┘              └──Room────┘
```

### Étape 3 : Connecter Deux Actions

**Comment les cartes se connectent ?**

```javascript
// 1. Tu cliques sur le point du BAS d'une carte
CustomNode.tsx
  <Handle type="source" position={Position.Bottom} />
  // ↑ Point de sortie

// 2. Tu glisses vers le point du HAUT d'une autre carte
CustomNode.tsx
  <Handle type="target" position={Position.Top} />
  // ↑ Point d'entrée

// 3. ReactFlow détecte la connexion
WorkflowBuilder.tsx
  onConnect={(params) => {
    // params = { source: 'create-1', target: 'msg-1' }
    const newEdge = {
      id: `e${Date.now()}`,
      source: params.source,  // D'où ça part
      target: params.target   // Où ça arrive
    };
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  }}
```

**Résultat visuel :**
```
[🔵 Create Room]
        │
        │ ← Flèche bleue animée
        ↓
[🟢 Send Message]
```

### Étape 4 : Configurer une Action

**Qu'est-ce qui se passe quand tu cliques sur une carte ?**

```javascript
// 1. Tu cliques sur une carte
WorkflowBuilder.tsx
  onNodeClick={(event, node) => {
    setSelectedNode(node);  // Sauvegarder le node cliqué
  }}

// 2. ConfigPanel s'ouvre automatiquement
WorkflowBuilder.tsx (render)
  {selectedNode && (
    <ConfigPanel
      selectedNode={selectedNode}
      onUpdate={onUpdateNodeConfig}
    />
  )}

// 3. ConfigPanel affiche le bon formulaire
ConfigPanel.tsx
  switch (selectedNode.data.type) {
    case 'createRoom':
      return (
        <>
          <input name="roomName" />
          <select name="visibility" />
          {/* etc... */}
        </>
      );
    case 'sendMessage':
      return (
        <>
          <textarea name="message" />
          <select name="format" />
        </>
      );
    // etc...
  }

// 4. Tu remplis les champs et cliques "Sauvegarder"
ConfigPanel.tsx
  onSave() {
    onUpdate(selectedNode.id, formData);
  }

// 5. Les données sont sauvegardées dans le node
WorkflowBuilder.tsx
  onUpdateNodeConfig(nodeId, newConfig) {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: newConfig } }
          : node
      )
    );
  }
```

**Résultat :**
```
Avant :                    Après :
[🔵 Create Room]          [🔵 Create Room ✓]
  config: {}               config: {
                             roomName: "Bienvenue",
                             visibility: "private"
                           }
```

### Étape 5 : Exporter le Workflow

**Que fait le bouton "Exporter" ?**

```javascript
WorkflowBuilder.tsx
  const onExport = () => {
    // 1. On crée un objet JSON avec tout
    const workflow = {
      name: workflowName,          // "Mon workflow Matrix"
      nodes: nodes,                 // Toutes les cartes
      edges: edges                  // Toutes les connexions
    };

    // 2. On convertit en texte JSON
    const json = JSON.stringify(workflow, null, 2);

    // 3. On crée un fichier téléchargeable
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // 4. On déclenche le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflowName}.json`;
    link.click();
  };
```

**Fichier généré :**
```json
{
  "name": "Mon workflow Matrix",
  "nodes": [
    {
      "id": "create-1",
      "type": "createRoom",
      "position": { "x": 250, "y": 50 },
      "data": {
        "label": "Create Room",
        "type": "createRoom",
        "config": {
          "roomName": "Bienvenue",
          "visibility": "private"
        }
      }
    },
    {
      "id": "msg-1",
      "type": "sendMessage",
      "position": { "x": 250, "y": 200 },
      "data": {
        "label": "Send Message",
        "type": "sendMessage",
        "config": {
          "message": "Hello!"
        }
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "create-1",
      "target": "msg-1"
    }
  ]
}
```

---

## 🐍 Comment Ça Marche - BACKEND (À Implémenter)

### Étape 1 : Lire le JSON

```python
# backend/executor.py
import json

def load_workflow(json_file):
    with open(json_file) as f:
        workflow = json.load(f)
    
    # Maintenant on a :
    # workflow['name']  → "Mon workflow Matrix"
    # workflow['nodes'] → Liste de toutes les actions
    # workflow['edges'] → Liste des connexions
    
    return workflow
```

### Étape 2 : Se Connecter à Luxchat

```python
from nio import AsyncClient

async def connect_to_luxchat():
    client = AsyncClient(
        "https://poc.luxchat4pro.lu",
        "@better42team:poc.luxchat4pro.lu"
    )
    
    # Login avec le JWT du hackathon
    response = await client.login_with_token(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    )
    
    if hasattr(response, 'access_token'):
        print("✓ Connecté à Luxchat !")
        return client
    else:
        print("✗ Erreur de connexion")
        return None
```

### Étape 3 : Exécuter les Actions Dans l'Ordre

```python
async def execute_workflow(workflow, client):
    # 1. Trouver l'ordre d'exécution
    order = topological_sort(workflow['nodes'], workflow['edges'])
    # order = ['create-1', 'msg-1', 'wait-1', ...]
    
    # 2. Contexte partagé entre actions
    context = {}
    
    # 3. Exécuter chaque action
    for node_id in order:
        node = find_node_by_id(workflow['nodes'], node_id)
        
        print(f"⚡ Exécution : {node['data']['label']}")
        
        # Dispatcher vers la bonne action
        if node['type'] == 'createRoom':
            result = await execute_create_room(node, client, context)
        elif node['type'] == 'sendMessage':
            result = await execute_send_message(node, client, context)
        # etc...
        
        # Sauvegarder le résultat
        context[node_id] = result
```

### Étape 4 : Exemple d'Action - Create Room

```python
async def execute_create_room(node, client, context):
    config = node['data']['config']
    
    # Créer le salon Matrix
    response = await client.room_create(
        name=config['roomName'],          # "Bienvenue"
        visibility=config['visibility']   # "private"
    )
    
    if hasattr(response, 'room_id'):
        room_id = response.room_id
        print(f"  ✓ Salon créé : {room_id}")
        
        # Sauvegarder dans le contexte
        context['last_room_id'] = room_id
        
        return {
            'success': True,
            'room_id': room_id
        }
    else:
        print(f"  ✗ Erreur : {response}")
        return {
            'success': False,
            'error': str(response)
        }
```

### Étape 5 : Exemple d'Action - Send Message

```python
async def execute_send_message(node, client, context):
    config = node['data']['config']
    
    # Récupérer le room_id du contexte
    room_id = config.get('targetRoom') or context.get('last_room_id')
    
    # Envoyer le message
    response = await client.room_send(
        room_id=room_id,
        message_type="m.room.message",
        content={
            "msgtype": "m.text",
            "body": config['message']  # "Hello!"
        }
    )
    
    if hasattr(response, 'event_id'):
        print(f"  ✓ Message envoyé : {response.event_id}")
        return {
            'success': True,
            'event_id': response.event_id
        }
    else:
        print(f"  ✗ Erreur : {response}")
        return {
            'success': False,
            'error': str(response)
        }
```

---

## 🔄 Flow de Données Complet

### Du Frontend au Backend

```
┌─────────────────────────────────────────────────────┐
│  1. FRONTEND (React)                                │
│     Utilisateur crée visuellement                   │
│        ↓                                             │
│     [Create Room] → [Send Message] → [Wait]         │
│        ↓                                             │
│     Clique "Exporter"                                │
│        ↓                                             │
│     workflow.json téléchargé                         │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  2. TRANSFERT                                       │
│     Email / Chat / Drive                            │
│        ↓                                             │
│     Timo reçoit workflow.json                       │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  3. BACKEND (Python)                                │
│     python executor.py workflow.json                │
│        ↓                                             │
│     Lit le JSON                                      │
│        ↓                                             │
│     Connecte à Luxchat                              │
│        ↓                                             │
│     Exécute Create Room                             │
│        ↓                                             │
│     Exécute Send Message                            │
│        ↓                                             │
│     Exécute Wait                                    │
│        ↓                                             │
│     Retourne succès/erreurs                         │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  4. LUXCHAT (Serveur Matrix)                        │
│     Salon créé : !abc123:luxchat.lu                 │
│     Message envoyé : $event456                      │
│     Visible dans l'app Luxchat !                    │
└─────────────────────────────────────────────────────┘
```

---

## 🧩 Chaque Composant Expliqué

### 1. WorkflowBuilder.tsx - Le Chef d'Orchestre

**Rôle :** Coordonne TOUT

**État (State) :**
```javascript
const [nodes, setNodes] = useState([]);        // Toutes les cartes
const [edges, setEdges] = useState([]);        // Toutes les connexions
const [selectedNode, setSelectedNode] = useState(null);  // Carte cliquée
const [workflowName, setWorkflowName] = useState('...');
const [showTemplates, setShowTemplates] = useState(false);
const [showImport, setShowImport] = useState(false);
```

**Fonctions principales :**
```javascript
onConnect()           // Quand tu connectes 2 cartes
onNodeClick()         // Quand tu cliques sur une carte
onUpdateNodeConfig()  // Quand tu sauvegardes une config
onAddNode()           // Quand tu ajoutes une carte
onDrop()              // Quand tu lâches une carte sur le canvas
onExport()            // Exporter en JSON
onImport()            // Importer depuis JSON
onDuplicate()         // Dupliquer le workflow
```

### 2. CustomNode.tsx - Les Cartes Colorées

**Rôle :** Afficher chaque action avec son style

**Ce qu'il fait :**
```javascript
// 1. Récupère les données du node
const Icon = iconMap[nodeType];     // Icône
const gradient = gradientMap[nodeType];  // Couleur

// 2. Affiche la carte avec :
- Dégradé de couleur (bleu, vert, violet...)
- Icône (Plus, MessageSquare, Clock...)
- Nom de l'action
- Badge "Configured" si configuré
- Points de connexion haut/bas (Handles)
- Effet de brillance au survol
```

**7 Couleurs différentes :**
```javascript
createRoom    → Bleu
inviteUser    → Émeraude
sendMessage   → Violet
waitTime      → Ambre
analyseStats  → Rose
destroyRoom   → Rouge
webhookTrigger → Indigo
```

### 3. NodePalette.tsx - Menu de Gauche

**Rôle :** Afficher les 7 actions disponibles

**Ce qu'il fait :**
```javascript
NODE_TYPES.map((nodeType) => (
  <div
    draggable={true}  // Peut être glissé
    onDragStart={(e) => {
      e.dataTransfer.setData('nodeType', nodeType.type);
    }}
    onClick={() => onAddNode(nodeType.type)}
  >
    <Icon />
    <Label />
    <Description />
  </div>
))
```

### 4. ConfigPanel.tsx - Menu de Droite

**Rôle :** Formulaires de configuration

**Ce qu'il fait :**
```javascript
switch (selectedNode.data.type) {
  case 'createRoom':
    // Formulaire avec :
    // - Input roomName
    // - Select visibility
    // - Input members
    break;
    
  case 'sendMessage':
    // Formulaire avec :
    // - Textarea message
    // - Select format
    break;
    
  // etc pour les 7 types...
}

// Quand tu cliques "Sauvegarder" :
const handleSave = () => {
  onUpdate(selectedNode.id, formData);
};
```

### 5. TemplateGallery.tsx - Galerie de Modèles

**Rôle :** Workflows prédéfinis

**Ce qu'il contient :**
```javascript
const templates = [
  {
    name: "Onboarding Automatique",
    workflow: {
      nodes: [...],  // 4 nodes prédéfinis
      edges: [...]   // 3 connexions
    }
  },
  // 3 autres templates...
];

// Quand tu cliques sur un template :
onClick={() => {
  onLoadTemplate(template.workflow);
}}
```

### 6. ImportModal.tsx - Fenêtre d'Import

**Rôle :** Importer un fichier JSON

**Ce qu'il fait :**
```javascript
// 1. Drag & Drop
onDrop={(e) => {
  const file = e.dataTransfer.files[0];
  handleFile(file);
}}

// 2. Lire le fichier
const handleFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const workflow = JSON.parse(e.target.result);
    onImport(workflow);  // Charge dans l'app
  };
  reader.readAsText(file);
};
```

---

## ⚙️ Les 7 Actions Matrix Expliquées

### 1. Create Room

**Que fait-elle ?**
Crée un nouveau salon Matrix

**Configuration :**
- `roomName` : Nom du salon (ex: "Bienvenue")
- `visibility` : public ou private
- `members` : Liste d'@usernames à inviter

**Code Backend :**
```python
await client.room_create(
    name=config['roomName'],
    visibility=config['visibility']
)
```

**Résultat :**
Nouveau salon apparaît dans Luxchat !

---

### 2. Invite User

**Que fait-elle ?**
Invite un utilisateur dans un salon

**Configuration :**
- `userId` : @username:luxchat.lu
- `roomId` : ID du salon (ou auto depuis contexte)

**Code Backend :**
```python
await client.room_invite(
    room_id=config['roomId'],
    user_id=config['userId']
)
```

**Résultat :**
L'utilisateur reçoit une invitation !

---

### 3. Send Message

**Que fait-elle ?**
Envoie un message dans un salon

**Configuration :**
- `message` : Texte du message
- `format` : plain, markdown, ou html
- `targetRoom` : Salon cible (ou auto)

**Code Backend :**
```python
await client.room_send(
    room_id=config['targetRoom'],
    message_type="m.room.message",
    content={
        "msgtype": "m.text",
        "body": config['message']
    }
)
```

**Résultat :**
Message apparaît dans le salon !

---

### 4. Wait Time

**Que fait-elle ?**
Attend un certain temps avant de continuer

**Configuration :**
- `duration` : Nombre (1, 5, 60...)
- `unit` : seconds, minutes, hours, days

**Code Backend :**
```python
import asyncio

if config['unit'] == 'seconds':
    seconds = config['duration']
elif config['unit'] == 'minutes':
    seconds = config['duration'] * 60
# etc...

await asyncio.sleep(seconds)
```

**Résultat :**
Le workflow pause !

---

### 5. Analyse Stats

**Que fait-elle ?**
Récupère des statistiques sur un salon

**Configuration :**
- `statsType` : room, user, ou server
- `timeRange` : Période (1h, 24h, 7d...)

**Code Backend :**
```python
# Récupérer l'historique
messages = await client.room_messages(
    room_id=room_id,
    limit=1000
)

# Analyser
stats = {
    'message_count': len(messages.chunk),
    'user_count': len(set(msg.sender for msg in messages.chunk))
}
```

**Résultat :**
Données statistiques disponibles !

---

### 6. Destroy Room

**Que fait-elle ?**
Supprime un salon (DANGER !)

**Configuration :**
- `roomId` : ID du salon à détruire

**Code Backend :**
```python
await client.room_kick(
    room_id=config['roomId'],
    user_id=client.user_id,
    reason="Auto-destruction"
)
```

**Résultat :**
Le salon est supprimé définitivement !

---

### 7. Webhook Trigger

**Que fait-elle ?**
Appelle une URL externe (API)

**Configuration :**
- `webhookUrl` : URL à appeler
- `method` : GET ou POST

**Code Backend :**
```python
import aiohttp

async with aiohttp.ClientSession() as session:
    if config['method'] == 'POST':
        async with session.post(
            config['webhookUrl'],
            json={'event': 'workflow_triggered'}
        ) as response:
            return await response.json()
```

**Résultat :**
Déclenche une action externe !

---

## 🎯 Exemple Complet : Workflow d'Onboarding

### 1. Frontend - Création Visuelle

```
Tu glisses ces cartes :
[🔵 Create Room "Bienvenue"]
        ↓
[🟢 Send Message "Salut !"]
        ↓
[🟠 Wait 5 seconds]
        ↓
[🌸 Analyse Stats]
```

### 2. Export JSON

```json
{
  "name": "Onboarding",
  "nodes": [
    {
      "id": "create-1",
      "type": "createRoom",
      "data": {
        "config": {
          "roomName": "Bienvenue",
          "visibility": "private"
        }
      }
    },
    {
      "id": "msg-1",
      "type": "sendMessage",
      "data": {
        "config": {
          "message": "Salut !"
        }
      }
    },
    {
      "id": "wait-1",
      "type": "waitTime",
      "data": {
        "config": {
          "duration": 5,
          "unit": "seconds"
        }
      }
    },
    {
      "id": "stats-1",
      "type": "analyseStats",
      "data": {
        "config": {
          "statsType": "room"
        }
      }
    }
  ],
  "edges": [
    {"source": "create-1", "target": "msg-1"},
    {"source": "msg-1", "target": "wait-1"},
    {"source": "wait-1", "target": "stats-1"}
  ]
}
```

### 3. Backend - Exécution

```python
# Étape 1 : Créer le salon
room = await client.room_create(name="Bienvenue")
# → Salon créé : !abc123:luxchat.lu

# Étape 2 : Envoyer le message
await client.room_send(
    room_id="!abc123:luxchat.lu",
    content={"body": "Salut !"}
)
# → Message envoyé

# Étape 3 : Attendre
await asyncio.sleep(5)
# → Pause de 5 secondes

# Étape 4 : Analyser
messages = await client.room_messages(room_id="!abc123:luxchat.lu")
stats = {"count": len(messages.chunk)}
# → Stats récupérées
```

### 4. Résultat dans Luxchat

```
┌─────────────────────────────┐
│  Salon "Bienvenue"          │
│                             │
│  Bot: Salut ! 💬            │
│                             │
│  [5 secondes plus tard]     │
│                             │
│  Stats: 1 message           │
└─────────────────────────────┘
```

---

## 💡 Points Clés à Retenir

### Frontend (Ce que tu as fait)

✅ **Interface visuelle** avec glisser-déposer  
✅ **7 types d'actions** Matrix prédéfinies  
✅ **Connexions visuelles** entre actions  
✅ **Configuration** de chaque action  
✅ **Export JSON** pour le backend  
✅ **Import/Templates** pour réutiliser  

### Backend (À faire)

⏳ **Lire le JSON** exporté  
⏳ **Se connecter** à Luxchat  
⏳ **Exécuter les actions** dans l'ordre  
⏳ **Gérer le contexte** entre actions  
⏳ **Retourner les résultats**  

### Luxchat (Déjà là)

✅ **Serveur Matrix** hébergé  
✅ **Credentials** fournis par le hackathon  
✅ **API** pour créer salons, envoyer messages, etc.  

---

## 🚀 Ce Qu'Il Reste à Faire

1. **Backend Python** (1 jour)
   - Implémenter les 7 actions
   - Parser le JSON
   - Exécuter dans l'ordre

2. **Intégration** (2h)
   - Connecter le bouton "Exécuter"
   - Afficher les logs en temps réel

3. **Tests** (1h)
   - Tester chaque action
   - Tester des workflows complets

4. **Démo** (30min)
   - Préparer le pitch
   - Workflow de démonstration

---

**Tu as des questions sur une partie spécifique ? 🤔**
