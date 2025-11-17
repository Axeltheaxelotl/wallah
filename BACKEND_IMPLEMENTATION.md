# 🔧 Backend - Guide d'Implémentation

## 🎯 Objectif

Créer un backend qui **lit le JSON** généré par le frontend et **exécute les actions Matrix**.

---

## 📋 Checklist Rapide

- [ ] Setup environnement Python/Node
- [ ] Installer SDK Matrix
- [ ] Se connecter au serveur Luxchat
- [ ] Créer compte bot
- [ ] Parser le JSON du workflow
- [ ] Implémenter les 7 actions
- [ ] Tester chaque action
- [ ] Créer API REST (optionnel)
- [ ] Intégrer avec le frontend

---

## 🛠️ Stack Recommandée

### Option 1 : Python (Recommandé ⭐)

**Pourquoi** : SDK Matrix stable, async natif, facile à debug

```bash
pip install matrix-nio aiohttp fastapi uvicorn
```

**Exemple de code** :
```python
from nio import AsyncClient
import asyncio
import json

async def main():
    client = AsyncClient("https://luxchat.lu", "@bot:luxchat.lu")
    await client.login("password")
    
    # Exécuter le workflow
    with open('workflow.json') as f:
        workflow = json.load(f)
    
    await execute_workflow(client, workflow)
    await client.close()

asyncio.run(main())
```

### Option 2 : Node.js

**Pourquoi** : Même langage que le frontend, bon pour les WebSockets

```bash
npm install matrix-js-sdk express cors
```

---

## 🔌 Connexion au Serveur Luxchat

### 1. Récupérer les Credentials

Le hackathon fournit :
- **URL du serveur** : `https://luxchat.lu` ou `https://matrix.hackathon.lu`
- **Compte bot** : `@workflow-bot:luxchat.lu`
- **Mot de passe** : Fourni sur Framagit ou dans Luxchat

### 2. Se Connecter

```python
from nio import AsyncClient

# Connexion
client = AsyncClient(
    homeserver="https://luxchat.lu",
    user="@workflow-bot:luxchat.lu"
)

response = await client.login(password="ton_mot_de_passe")

if hasattr(response, 'access_token'):
    print(f"✓ Connecté ! Token: {response.access_token}")
else:
    print(f"✗ Erreur: {response}")
```

### 3. Tester la Connexion

```python
# Récupérer les rooms du bot
sync_response = await client.sync(timeout=30000)
print(f"Rooms: {sync_response.rooms.join.keys()}")
```

---

## 📦 Structure du Projet Backend

```
backend/
├── main.py                 # Point d'entrée
├── workflow_executor.py    # Logique d'exécution
├── matrix_actions.py       # Implémentation des 7 actions
├── utils.py                # Fonctions utilitaires
├── requirements.txt        # Dépendances
└── workflows/              # Dossier pour les JSON
    └── example.json
```

---

## 🧩 Implémentation des 7 Actions

### 1. Create Room

**JSON Frontend** :
```json
{
  "type": "createRoom",
  "data": {
    "config": {
      "roomName": "Mon Salon",
      "visibility": "private",
      "parentSpace": "!space123:luxchat.lu",
      "members": ["@alice:luxchat.lu", "@bob:luxchat.lu"]
    }
  }
}
```

**Code Backend** :
```python
async def action_create_room(client, config, context):
    """Crée un nouveau salon Matrix"""
    try:
        response = await client.room_create(
            name=config.get('roomName', 'Nouveau salon'),
            visibility=config.get('visibility', 'private'),
            invite=config.get('members', []),
            # initial_state pour ajouter au parent space
            initial_state=[
                {
                    "type": "m.space.parent",
                    "state_key": config.get('parentSpace', ''),
                    "content": {"via": ["luxchat.lu"]}
                }
            ] if config.get('parentSpace') else []
        )
        
        room_id = response.room_id
        context['last_room_id'] = room_id
        
        print(f"✓ Room créé: {room_id}")
        return {"success": True, "room_id": room_id}
    
    except Exception as e:
        print(f"✗ Erreur createRoom: {e}")
        return {"success": False, "error": str(e)}
```

---

### 2. Invite User

**JSON Frontend** :
```json
{
  "type": "inviteUser",
  "data": {
    "config": {
      "userId": "@charlie:luxchat.lu",
      "roomId": "!abc123:luxchat.lu"
    }
  }
}
```

**Code Backend** :
```python
async def action_invite_user(client, config, context):
    """Invite un utilisateur dans un salon"""
    try:
        room_id = config.get('roomId') or context.get('last_room_id')
        user_id = config.get('userId')
        
        if not room_id or not user_id:
            return {"success": False, "error": "roomId ou userId manquant"}
        
        response = await client.room_invite(
            room_id=room_id,
            user_id=user_id
        )
        
        print(f"✓ Invitation envoyée à {user_id} dans {room_id}")
        return {"success": True}
    
    except Exception as e:
        print(f"✗ Erreur inviteUser: {e}")
        return {"success": False, "error": str(e)}
```

---

### 3. Send Message

**JSON Frontend** :
```json
{
  "type": "sendMessage",
  "data": {
    "config": {
      "message": "Bonjour ! 👋",
      "format": "markdown",
      "targetRoom": "!abc123:luxchat.lu"
    }
  }
}
```

**Code Backend** :
```python
async def action_send_message(client, config, context):
    """Envoie un message dans un salon"""
    try:
        room_id = config.get('targetRoom') or context.get('last_room_id')
        message = config.get('message', '')
        format_type = config.get('format', 'plain')
        
        if not room_id:
            return {"success": False, "error": "Aucun roomId spécifié"}
        
        content = {
            "msgtype": "m.text",
            "body": message
        }
        
        # Si markdown ou HTML, ajouter formatted_body
        if format_type in ['markdown', 'html']:
            import markdown  # pip install markdown
            
            if format_type == 'markdown':
                html_message = markdown.markdown(message)
            else:
                html_message = message
            
            content["format"] = "org.matrix.custom.html"
            content["formatted_body"] = html_message
        
        response = await client.room_send(
            room_id=room_id,
            message_type="m.room.message",
            content=content
        )
        
        print(f"✓ Message envoyé dans {room_id}")
        return {"success": True, "event_id": response.event_id}
    
    except Exception as e:
        print(f"✗ Erreur sendMessage: {e}")
        return {"success": False, "error": str(e)}
```

---

### 4. Wait Time

**JSON Frontend** :
```json
{
  "type": "waitTime",
  "data": {
    "config": {
      "duration": 30,
      "unit": "seconds"
    }
  }
}
```

**Code Backend** :
```python
async def action_wait_time(client, config, context):
    """Attend un certain temps"""
    try:
        duration = config.get('duration', 0)
        unit = config.get('unit', 'seconds')
        
        # Conversion en secondes
        seconds = {
            'seconds': duration,
            'minutes': duration * 60,
            'hours': duration * 3600
        }.get(unit, duration)
        
        print(f"⏳ Attente de {duration} {unit} ({seconds}s)...")
        await asyncio.sleep(seconds)
        print(f"✓ Attente terminée")
        
        return {"success": True}
    
    except Exception as e:
        print(f"✗ Erreur waitTime: {e}")
        return {"success": False, "error": str(e)}
```

---

### 5. Analyse Stats

**JSON Frontend** :
```json
{
  "type": "analyseStats",
  "data": {
    "config": {
      "statsType": "roomActivity",
      "timeRange": "24h"
    }
  }
}
```

**Code Backend** :
```python
from datetime import datetime, timedelta

async def action_analyse_stats(client, config, context):
    """Analyse les statistiques d'un salon"""
    try:
        room_id = context.get('last_room_id')
        if not room_id:
            return {"success": False, "error": "Aucun room à analyser"}
        
        stats_type = config.get('statsType', 'roomActivity')
        time_range = config.get('timeRange', '24h')
        
        # Récupérer les messages récents
        response = await client.room_messages(
            room_id=room_id,
            start="",
            limit=1000
        )
        
        messages = response.chunk
        
        # Calculer la période
        hours = int(time_range.replace('h', '').replace('d', '')) * (24 if 'd' in time_range else 1)
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        # Filtrer les messages dans la période
        recent_messages = [
            msg for msg in messages
            if datetime.fromtimestamp(msg.server_timestamp / 1000) > cutoff_time
        ]
        
        # Statistiques
        stats = {
            'total_messages': len(recent_messages),
            'unique_users': len(set([msg.sender for msg in recent_messages])),
            'period': time_range,
            'room_id': room_id
        }
        
        if stats_type == 'messageCount':
            stats['count'] = len(recent_messages)
        elif stats_type == 'userActivity':
            stats['users'] = {}
            for msg in recent_messages:
                sender = msg.sender
                stats['users'][sender] = stats['users'].get(sender, 0) + 1
        
        context['stats'] = stats
        print(f"✓ Stats calculées: {stats}")
        
        return {"success": True, "stats": stats}
    
    except Exception as e:
        print(f"✗ Erreur analyseStats: {e}")
        return {"success": False, "error": str(e)}
```

---

### 6. Destroy Room

**JSON Frontend** :
```json
{
  "type": "destroyRoom",
  "data": {
    "config": {
      "roomId": "!abc123:luxchat.lu"
    }
  }
}
```

**Code Backend** :
```python
async def action_destroy_room(client, config, context):
    """Supprime un salon (attention : irréversible !)"""
    try:
        room_id = config.get('roomId') or context.get('last_room_id')
        
        if not room_id:
            return {"success": False, "error": "Aucun roomId spécifié"}
        
        # Vérifier les permissions d'abord
        power_levels = await client.room_get_state_event(
            room_id, 'm.room.power_levels'
        )
        
        user_level = power_levels.content['users'].get(client.user_id, 0)
        if user_level < 100:  # Besoin de niveau 100 pour destroy
            return {"success": False, "error": "Pas assez de permissions"}
        
        # Quitter le room (équivalent de destroy pour un bot)
        await client.room_leave(room_id)
        await client.room_forget(room_id)
        
        print(f"✓ Room supprimé: {room_id}")
        return {"success": True}
    
    except Exception as e:
        print(f"✗ Erreur destroyRoom: {e}")
        return {"success": False, "error": str(e)}
```

---

### 7. Webhook Trigger

**JSON Frontend** :
```json
{
  "type": "webhookTrigger",
  "data": {
    "config": {
      "webhookUrl": "https://example.com/api/notify",
      "method": "POST",
      "headers": {"Authorization": "Bearer token123"}
    }
  }
}
```

**Code Backend** :
```python
import aiohttp

async def action_webhook_trigger(client, config, context):
    """Appelle un webhook externe"""
    try:
        url = config.get('webhookUrl')
        method = config.get('method', 'POST')
        headers = config.get('headers', {})
        
        if not url:
            return {"success": False, "error": "webhookUrl manquant"}
        
        # Payload avec le contexte du workflow
        payload = {
            'workflow': context.get('workflow_id'),
            'room_id': context.get('last_room_id'),
            'stats': context.get('stats')
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.request(
                method=method,
                url=url,
                headers=headers,
                json=payload
            ) as response:
                result = await response.json()
                
                print(f"✓ Webhook appelé: {url} → {response.status}")
                return {"success": True, "response": result}
    
    except Exception as e:
        print(f"✗ Erreur webhookTrigger: {e}")
        return {"success": False, "error": str(e)}
```

---

## 🔄 Orchestrateur de Workflow

**Fichier** : `workflow_executor.py`

```python
import json
import asyncio
from nio import AsyncClient
from matrix_actions import (
    action_create_room,
    action_invite_user,
    action_send_message,
    action_wait_time,
    action_analyse_stats,
    action_destroy_room,
    action_webhook_trigger
)

# Map des actions
ACTIONS = {
    'createRoom': action_create_room,
    'inviteUser': action_invite_user,
    'sendMessage': action_send_message,
    'waitTime': action_wait_time,
    'analyseStats': action_analyse_stats,
    'destroyRoom': action_destroy_room,
    'webhookTrigger': action_webhook_trigger
}

def find_execution_order(nodes, edges):
    """
    Trouve l'ordre d'exécution des nodes en suivant les edges
    """
    # Construire un graphe
    node_ids = {node['id'] for node in nodes}
    graph = {node_id: [] for node_id in node_ids}
    in_degree = {node_id: 0 for node_id in node_ids}
    
    for edge in edges:
        source = edge['source']
        target = edge['target']
        graph[source].append(target)
        in_degree[target] += 1
    
    # Tri topologique
    queue = [node_id for node_id in node_ids if in_degree[node_id] == 0]
    order = []
    
    while queue:
        node_id = queue.pop(0)
        order.append(node_id)
        
        for neighbor in graph[node_id]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return order

async def execute_workflow(client, workflow):
    """
    Exécute un workflow complet
    """
    nodes = workflow['nodes']
    edges = workflow['edges']
    
    # Trouver l'ordre d'exécution
    execution_order = find_execution_order(nodes, edges)
    
    print(f"\n📋 Ordre d'exécution: {execution_order}\n")
    
    # Créer un dict pour accès rapide
    nodes_dict = {node['id']: node for node in nodes}
    
    # Contexte partagé entre nodes
    context = {
        'workflow_id': workflow['id'],
        'workflow_name': workflow['name']
    }
    
    results = []
    
    # Exécuter chaque node
    for i, node_id in enumerate(execution_order):
        node = nodes_dict[node_id]
        node_type = node['type']
        config = node['data']['config']
        
        print(f"[{i+1}/{len(execution_order)}] Exécution: {node_type} ({node_id})")
        
        # Récupérer la fonction d'action
        action_func = ACTIONS.get(node_type)
        
        if not action_func:
            print(f"✗ Type de node inconnu: {node_type}")
            results.append({
                'node_id': node_id,
                'success': False,
                'error': f'Type inconnu: {node_type}'
            })
            continue
        
        # Exécuter l'action
        result = await action_func(client, config, context)
        result['node_id'] = node_id
        result['node_type'] = node_type
        results.append(result)
        
        # Si erreur, arrêter ?
        if not result.get('success'):
            print(f"\n⚠️ Erreur détectée, arrêt du workflow\n")
            break
    
    print("\n✓ Workflow terminé !\n")
    
    return {
        'status': 'completed' if all(r.get('success') for r in results) else 'failed',
        'results': results,
        'context': context
    }

async def main():
    """Point d'entrée principal"""
    
    # Connexion au serveur Matrix
    client = AsyncClient(
        homeserver="https://luxchat.lu",
        user="@workflow-bot:luxchat.lu"
    )
    
    print("🔌 Connexion à Luxchat...")
    await client.login(password="ton_mot_de_passe")
    print("✓ Connecté !\n")
    
    # Charger le workflow
    with open('workflows/example.json', 'r') as f:
        workflow = json.load(f)
    
    print(f"📄 Workflow: {workflow['name']}\n")
    
    # Exécuter
    result = await execute_workflow(client, workflow)
    
    # Afficher les résultats
    print("\n📊 Résultats:")
    print(json.dumps(result, indent=2))
    
    # Déconnexion
    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 🚀 Lancer le Backend

### 1. Installation
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configuration

Créer un fichier `.env` :
```env
MATRIX_HOMESERVER=https://luxchat.lu
MATRIX_USER=@workflow-bot:luxchat.lu
MATRIX_PASSWORD=ton_mot_de_passe
```

### 3. Test avec un Workflow
```bash
python workflow_executor.py
```

---

## 🔗 API REST (Optionnel)

Pour permettre au frontend d'exécuter des workflows via HTTP :

```python
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Autoriser le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/execute-workflow")
async def execute_workflow_api(file: UploadFile):
    """Endpoint pour exécuter un workflow"""
    
    # Lire le fichier JSON
    workflow = json.loads(await file.read())
    
    # Créer client Matrix
    client = AsyncClient("https://luxchat.lu", "@bot:luxchat.lu")
    await client.login("password")
    
    # Exécuter
    result = await execute_workflow(client, workflow)
    
    # Fermer connexion
    await client.close()
    
    return result

@app.post("/api/validate-workflow")
async def validate_workflow_api(file: UploadFile):
    """Valide un workflow sans l'exécuter"""
    workflow = json.loads(await file.read())
    
    errors = []
    
    # Vérifications basiques
    if not workflow.get('nodes'):
        errors.append("Aucun node dans le workflow")
    
    if not workflow.get('edges'):
        errors.append("Aucune connexion dans le workflow")
    
    return {
        "valid": len(errors) == 0,
        "errors": errors
    }

# Lancer le serveur
# uvicorn main:app --reload --port 8000
```

---

## 🎯 Intégration Frontend ↔ Backend

### Dans le Frontend (WorkflowBuilder.tsx)

```typescript
const onExecute = useCallback(async () => {
  // Créer le JSON
  const workflow = {
    id: `workflow-${Date.now()}`,
    name: workflowName,
    nodes: nodes,
    edges: edges
  };
  
  // Envoyer au backend
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(workflow)], {type: 'application/json'});
  formData.append('file', blob, 'workflow.json');
  
  try {
    const response = await fetch('http://localhost:8000/api/execute-workflow', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.status === 'completed') {
      alert('Workflow exécuté avec succès ! ✓');
    } else {
      alert('Erreur lors de l\'exécution');
      console.error(result);
    }
  } catch (error) {
    alert('Impossible de contacter le backend');
    console.error(error);
  }
}, [nodes, edges, workflowName]);
```

---

## ✅ Checklist de Test

- [ ] Connexion au serveur Luxchat réussie
- [ ] `createRoom` : Room créé visible dans Luxchat
- [ ] `sendMessage` : Message reçu dans Luxchat
- [ ] `inviteUser` : Invitation reçue
- [ ] `waitTime` : Délai respecté
- [ ] `analyseStats` : Stats correctes
- [ ] `destroyRoom` : Room supprimé
- [ ] `webhookTrigger` : Webhook appelé
- [ ] Workflow complet : Toutes les actions exécutées dans l'ordre
- [ ] Gestion d'erreur : Workflow arrêté si erreur

---

## 🎓 Conseils

1. **Commencer simple** : Tester d'abord `createRoom` + `sendMessage`
2. **Logs partout** : `print()` à chaque étape
3. **Tester dans Luxchat** : Vérifier visuellement le résultat
4. **Sauvegarder le token** : Pas besoin de login à chaque fois
5. **Permissions** : Vérifier que le bot a les droits nécessaires

---

Bon courage ! 🚀
