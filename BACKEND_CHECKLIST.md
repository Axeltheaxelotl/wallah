# ⚡ Backend - Points Importants (Checklist)

## 🎯 Ce que le backend DOIT faire

### Minimum Viable (pour le hackathon)

✅ **1. Se connecter à Luxchat**
```python
from nio import AsyncClient

client = AsyncClient("https://luxchat.lu", "@bot:luxchat.lu")
await client.login("password")
```

✅ **2. Lire le JSON du workflow**
```python
import json

with open('workflow.json') as f:
    workflow = json.load(f)
```

✅ **3. Exécuter les actions dans l'ordre**
```python
for node in workflow['nodes']:
    if node['type'] == 'createRoom':
        # Créer le room
    elif node['type'] == 'sendMessage':
        # Envoyer le message
    # etc...
```

---

## 🔑 Informations Cruciales

### Credentials Luxchat (fournis au hackathon)

```env
MATRIX_HOMESERVER=https://luxchat.lu  # ou https://matrix.hackathon.lu
MATRIX_USER=@votre-bot:luxchat.lu
MATRIX_PASSWORD=password_fourni_par_hackathon
```

**Où les trouver** :
- Framagit du hackathon
- Message privé dans Luxchat
- Room "MATRIX meets Luxchat"

---

## 📦 Dépendances Minimales

### Python
```bash
pip install matrix-nio aiohttp
```

### Node.js
```bash
npm install matrix-js-sdk
```

---

## 🔄 Gestion du Contexte (IMPORTANT!)

**Problème** : Un node a besoin des résultats d'un node précédent

**Exemple** :
- Node 1 : Create Room → génère un `room_id`
- Node 2 : Send Message → a besoin de ce `room_id`

**Solution** : Contexte partagé

```python
context = {}

# Dans createRoom
room_id = response.room_id
context['last_room_id'] = room_id  # Sauvegarde

# Dans sendMessage
room_id = config.get('targetRoom') or context['last_room_id']  # Récupère
```

---

## ⚠️ Points d'Attention

### 1. Ordre d'Exécution

Le JSON contient des `edges` qui définissent l'ordre :

```json
{
  "edges": [
    {"source": "node1", "target": "node2"},  // node1 AVANT node2
    {"source": "node2", "target": "node3"}   // node2 AVANT node3
  ]
}
```

**Algorithme** : Tri topologique des nodes

```python
def find_execution_order(nodes, edges):
    # Trouver les nodes sans parent
    all_nodes = {n['id'] for n in nodes}
    targets = {e['target'] for e in edges}
    starts = all_nodes - targets
    
    # Suivre les edges
    order = []
    # ... (voir BACKEND_IMPLEMENTATION.md)
    return order
```

### 2. Gestion des Erreurs

**IMPORTANT** : Toujours wrapper dans try/catch

```python
try:
    await client.room_create(...)
except Exception as e:
    return {
        "success": False,
        "node_id": node_id,
        "error": str(e)
    }
```

### 3. Permissions Matrix

Certaines actions nécessitent des droits spéciaux :

| Action | Permission Requise |
|--------|-------------------|
| createRoom | Aucune (tous peuvent créer) |
| inviteUser | Pouvoir inviter dans le room |
| destroyRoom | Être admin du room (level 100) |

**Vérifier avant d'exécuter** :

```python
power_levels = await client.room_get_state_event(room_id, 'm.room.power_levels')
user_level = power_levels['users'].get(client.user_id, 0)

if user_level < 50:  # Besoin de 50+ pour inviter
    raise PermissionError("Pas assez de permissions")
```

### 4. Formats de Message

Matrix supporte plusieurs formats :

```python
# Plain text
content = {
    "msgtype": "m.text",
    "body": "Hello"
}

# Markdown (converti en HTML)
import markdown
html = markdown.markdown("**Hello**")
content = {
    "msgtype": "m.text",
    "body": "**Hello**",
    "format": "org.matrix.custom.html",
    "formatted_body": html
}

# HTML direct
content = {
    "msgtype": "m.text",
    "body": "Hello",
    "format": "org.matrix.custom.html",
    "formatted_body": "<b>Hello</b>"
}
```

---

## 🧪 Tests Recommandés

### 1. Test de Connexion
```python
async def test_connection():
    client = AsyncClient(SERVER, USER)
    response = await client.login(PASSWORD)
    
    if hasattr(response, 'access_token'):
        print("✓ Connexion OK")
    else:
        print("✗ Erreur:", response)
```

### 2. Test Create Room
```python
async def test_create_room():
    room = await client.room_create(name="Test Room")
    print(f"✓ Room créé: {room.room_id}")
    
    # Vérifier dans Luxchat que le room existe
```

### 3. Test Send Message
```python
async def test_send_message():
    await client.room_send(
        room_id="!abc:luxchat.lu",
        message_type="m.room.message",
        content={"msgtype": "m.text", "body": "Test"}
    )
    print("✓ Message envoyé")
    
    # Vérifier dans Luxchat que le message est arrivé
```

### 4. Test Workflow Complet
```python
async def test_full_workflow():
    # 1. Create room
    room = await client.room_create(name="Test Workflow")
    room_id = room.room_id
    
    # 2. Send message
    await client.room_send(
        room_id=room_id,
        message_type="m.room.message",
        content={"msgtype": "m.text", "body": "Hello from workflow"}
    )
    
    # 3. Wait
    await asyncio.sleep(2)
    
    # 4. Get stats
    messages = await client.room_messages(room_id, limit=100)
    print(f"✓ Stats: {len(messages.chunk)} messages")
    
    print("✓ Workflow complet OK")
```

---

## 📊 Structure de Réponse Recommandée

Le backend devrait retourner :

```json
{
  "status": "success" | "error" | "partial",
  "workflow_id": "workflow-123",
  "executed_nodes": [
    {
      "node_id": "createRoom-1",
      "type": "createRoom",
      "success": true,
      "result": {
        "room_id": "!abc:luxchat.lu"
      }
    },
    {
      "node_id": "sendMessage-2",
      "type": "sendMessage",
      "success": true,
      "result": {
        "event_id": "$event123"
      }
    }
  ],
  "errors": [],
  "execution_time": "2.5s"
}
```

---

## 🚀 Timeline Recommandée (Hackathon)

### Jour 1 - Matin (3h)
- [ ] Setup environnement Python
- [ ] Installer matrix-nio
- [ ] Test connexion Luxchat
- [ ] Test createRoom + vérification visuelle

### Jour 1 - Après-midi (4h)
- [ ] Implémenter les 7 actions
- [ ] Test de chaque action individuellement
- [ ] Implémenter le parser JSON

### Jour 1 - Soir (2h)
- [ ] Implémenter l'ordre d'exécution
- [ ] Test workflow complet (2-3 actions)
- [ ] Debug

### Jour 2 - Matin (3h)
- [ ] Gestion des erreurs
- [ ] Validation du workflow
- [ ] API REST (optionnel)
- [ ] Intégration frontend-backend

### Jour 2 - Après-midi (2h avant pitch)
- [ ] Tests finaux
- [ ] Préparer la démo
- [ ] Backup vidéo

---

## 💡 Astuces

### 1. Debug avec Print
```python
print(f"[DEBUG] Exécution node: {node_type}")
print(f"[DEBUG] Config: {config}")
print(f"[DEBUG] Contexte: {context}")
```

### 2. Sauvegarder les Tokens
Pas besoin de login à chaque fois :

```python
# Premier login
response = await client.login(PASSWORD)
token = response.access_token

# Sauvegarder
with open('token.txt', 'w') as f:
    f.write(token)

# Réutiliser
client = AsyncClient(SERVER, USER)
client.access_token = open('token.txt').read()
client.user_id = USER
```

### 3. Logs en Temps Réel (optionnel mais cool)
```python
import asyncio

async def send_log(message):
    # Envoyer via WebSocket au frontend
    await websocket.send(json.dumps({
        "type": "log",
        "message": message
    }))

# Dans l'exécution
await send_log(f"✓ Room créé: {room_id}")
```

---

## 🎯 Objectif Final

**Démo du pitch** :

1. Ouvrir le frontend
2. Créer un workflow visuel en 30 secondes :
   - Create Room "Hackathon Winners"
   - Send Message "We did it! 🎉"
   - Invite User "@judge:luxchat.lu"

3. Cliquer "Exécuter"
4. **BOOM** → Le room apparaît dans Luxchat avec le message et l'invitation !

**WOW Effect garanti ! 🎉**

---

## 🆘 En Cas de Problème

### Erreur "Invalid credentials"
→ Vérifier les credentials dans Framagit ou Luxchat

### Erreur "Forbidden"
→ Le bot n'a pas les permissions, vérifier power_levels

### Erreur "Room not found"
→ Utiliser `context['last_room_id']` au lieu de hardcoder l'ID

### Le workflow ne s'exécute pas dans l'ordre
→ Vérifier l'algorithme de tri topologique

### Ça marche en local mais pas en prod
→ Vérifier les URLs (localhost vs luxchat.lu)

---

**Bon courage ! Vous allez cartonner ! 🚀**
