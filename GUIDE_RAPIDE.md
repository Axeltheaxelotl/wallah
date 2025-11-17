# 🎓 Guide Rapide - 5 Minutes pour Comprendre

## 🤔 C'est quoi ce projet ?

**Imagine** : Tu veux créer automatiquement un salon Matrix et envoyer un message de bienvenue.

**Normalement** : Tu dois coder en Python/JavaScript avec l'API Matrix
```python
# Code complexe...
client = AsyncClient(...)
await client.login(...)
room = await client.room_create(...)
await client.room_send(...)
```

**Avec notre outil** : Tu glisses 2 boxes sur un canvas et tu cliques "Exécuter" 🎉

---

## 🎨 Comment ça marche ?

### Vue d'ensemble

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   PALETTE   │  →   │    CANVAS    │  →   │   CONFIG    │
│             │      │              │      │             │
│ • Create    │      │   ┌──────┐   │      │ Room Name:  │
│   Room      │      │   │Node 1│   │      │ "Mon Salon" │
│             │      │   └──┬───┘   │      │             │
│ • Send      │      │      │       │      │ Members:    │
│   Message   │      │   ┌──▼───┐   │      │ @alice...   │
│             │      │   │Node 2│   │      │             │
│ • Invite    │      │   └──────┘   │      └─────────────┘
│   User      │      │              │
│             │      │              │
│ • ...       │      │              │
└─────────────┘      └──────────────┘
   (Gauche)            (Centre)            (Droite)
```

### Étape par Étape

#### 1️⃣ Choisis une action (Palette)
Clique ou glisse une action depuis la palette de gauche :
- Create Room
- Send Message
- Invite User
- etc.

#### 2️⃣ Dépose sur le canvas (Centre)
L'action apparaît comme une box colorée sur le canvas

#### 3️⃣ Configure l'action (Droite)
Clique sur la box → un panneau s'ouvre avec un formulaire :
- Pour "Create Room" : nom du salon, visibilité, membres
- Pour "Send Message" : le message, le format
- etc.

#### 4️⃣ Connecte les actions
Tire une ligne d'une box à une autre pour dire "fais ça PUIS ça"

#### 5️⃣ Exporte en JSON
Clique "Exporter" → télécharge un fichier `.json`

#### 6️⃣ Le backend exécute
Le backend lit le JSON et fait les actions Matrix automatiquement

---

## 📝 Exemple Concret

### Objectif : Créer un salon et envoyer un message

#### Ce que tu fais :

1. **Glisse "Create Room"** sur le canvas
2. **Clique dessus** → Configure :
   - Nom : "Bienvenue Team"
   - Membres : @alice@luxchat.lu, @bob@luxchat.lu

3. **Glisse "Send Message"** en dessous
4. **Clique dessus** → Configure :
   - Message : "Bonjour ! 👋"

5. **Connecte les deux** : Tire une ligne de "Create Room" vers "Send Message"

6. **Clique "Exporter"** → Fichier `bienvenue.json` téléchargé

#### Le JSON généré :

```json
{
  "nodes": [
    {
      "type": "createRoom",
      "config": {
        "roomName": "Bienvenue Team",
        "members": ["@alice@luxchat.lu", "@bob@luxchat.lu"]
      }
    },
    {
      "type": "sendMessage",
      "config": {
        "message": "Bonjour ! 👋"
      }
    }
  ],
  "edges": [
    {"source": "node1", "target": "node2"}
  ]
}
```

#### Ce que le backend fait :

```python
# 1. Lit le JSON
workflow = json.load('bienvenue.json')

# 2. Crée le salon
room = await client.room_create(
    name="Bienvenue Team",
    invite=["@alice@luxchat.lu", "@bob@luxchat.lu"]
)

# 3. Envoie le message
await client.room_send(
    room_id=room.room_id,
    message="Bonjour ! 👋"
)
```

#### Résultat :
Alice et Bob reçoivent une invitation dans "Bienvenue Team" avec le message "Bonjour ! 👋"

---

## 🎯 Les 7 Actions Expliquées Simplement

### 🔵 Create Room
**Fait quoi** : Crée un nouveau salon Matrix  
**Paramètres** : Nom, privé/public, qui inviter  
**Exemple** : Créer "Hackathon Team 1" avec 5 membres

---

### 🟢 Invite User
**Fait quoi** : Invite quelqu'un dans un salon  
**Paramètres** : L'utilisateur (@user:matrix.org), le salon  
**Exemple** : Inviter @alice dans le salon créé avant

---

### 🟣 Send Message
**Fait quoi** : Envoie un message dans un salon  
**Paramètres** : Le message, le format (texte/markdown/html), le salon  
**Exemple** : "Bienvenue ! 🎉" en markdown

---

### 🟡 Wait Time
**Fait quoi** : Attend avant de continuer  
**Paramètres** : Combien de temps, en quoi (secondes/minutes/heures)  
**Exemple** : Attendre 30 secondes avant d'envoyer le prochain message

---

### 🟠 Analyse Stats
**Fait quoi** : Récupère des infos sur un salon  
**Paramètres** : Quel type de stats, période  
**Exemple** : Compter les messages des dernières 24h

---

### 🔴 Destroy Room
**Fait quoi** : Supprime un salon (attention, irréversible !)  
**Paramètres** : Le salon à supprimer  
**Exemple** : Supprimer le salon après 1 heure (pour un salon temporaire)

---

### 🟣 Webhook Trigger
**Fait quoi** : Appelle une URL externe  
**Paramètres** : L'URL, GET ou POST  
**Exemple** : Notifier un autre service que le workflow est terminé

---

## 🌟 Cas d'Usage Réels

### Cas 1 : Onboarding Automatique
**Scénario** : Chaque nouvel employé reçoit automatiquement un salon de bienvenue

**Workflow** :
1. Create Room "Bienvenue [Nom]"
2. Send Message "Bienvenue dans l'entreprise !"
3. Invite User → Manager
4. Send Message "Voici ton guide de démarrage..."

---

### Cas 2 : Salon Temporaire
**Scénario** : Réunion dans 1h → salon auto-créé → auto-détruit après

**Workflow** :
1. Create Room "Réunion Sprint Planning"
2. Send Message "La réunion commence dans 1h"
3. Wait Time → 2 heures
4. Destroy Room

---

### Cas 3 : Rapports Automatiques
**Scénario** : Chaque jour, recevoir les stats d'activité

**Workflow** :
1. Analyse Stats → dernières 24h
2. Send Message avec les stats
3. Webhook Trigger → envoi à un dashboard

---

## 🤝 Qui Fait Quoi dans l'Équipe ?

### Frontend (déjà fait ✅)
- Interface graphique
- Drag & drop
- Formulaires de config
- Export JSON

### Backend (à faire 🔨)
- Connexion à Matrix
- Lecture du JSON
- Exécution des actions
- Gestion des erreurs

### Intégration (à faire 🔗)
- Bouton "Exécuter" qui appelle le backend
- Afficher les logs
- Gérer les erreurs

---

## 🚀 Prochaines Étapes

1. **Tester l'interface** : Ouvrir http://localhost:3000
2. **Créer un workflow de test** : Create Room + Send Message
3. **Exporter le JSON** : Voir à quoi ça ressemble
4. **Implémenter le backend** : Lire BACKEND_IMPLEMENTATION.md
5. **Tester end-to-end** : Du clic au résultat dans Luxchat

---

## 💡 Tips

- **Commence simple** : 1-2 actions max pour commencer
- **Teste visuellement** : Vérifie dans Luxchat que ça marche
- **Utilise les exemples** : Regarde `workflows/exemple_*.json`
- **Lis les docs** : README_DETAILLE.md explique tout en détail

---

## ❓ FAQ

**Q : Dois-je coder ?**  
R : Non pour le frontend (déjà fait). Oui pour le backend (Python simple).

**Q : Ça marche avec quel serveur Matrix ?**  
R : N'importe quel serveur (Synapse, Dendrite, etc.). Pour le hackathon : Luxchat.

**Q : C'est compliqué le backend ?**  
R : Non ! ~200 lignes de Python. Voir BACKEND_IMPLEMENTATION.md.

**Q : Je peux ajouter mes propres actions ?**  
R : Oui ! Il suffit d'ajouter un nouveau type de node dans `nodeTypes.ts` et l'action correspondante dans le backend.

**Q : C'est quoi ReactFlow ?**  
R : Une librairie React pour créer des éditeurs de workflow (comme n8n, Zapier, etc.).

---

Tout clair ? C'est parti ! 🚀
