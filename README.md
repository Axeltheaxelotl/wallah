# 🚀 Matrix Workflow Builder

**Un éditeur graphique de workflows pour automatiser Matrix/Luxchat, façon n8n.**

Créé pour le hackathon "Matrix meets Luxchat" - Luxembourg Internet Days 2025

---

## 🎯 Qu'est-ce que c'est ?

Un outil qui permet de **créer visuellement des automations Matrix** sans coder :
- Drag & drop des actions
- Configuration par formulaires
- Export en JSON
- Exécution par le backend

**Exemple** : Créer automatiquement un salon + envoyer un message de bienvenue + analyser les stats

---

## ✨ Fonctionnalités

### Frontend (React + ReactFlow) ✅
- **Canvas interactif** avec drag & drop
- **7 actions Matrix disponibles** :
  - 🔵 Create Room - Créer un salon
  - 🟢 Invite User - Inviter un utilisateur  
  - 🟣 Send Message - Envoyer un message
  - 🟡 Wait Time - Attendre un délai
  - 🟠 Analyse Stats - Récupérer des statistiques
  - 🔴 Destroy Room - Supprimer un salon
  - 🟣 Webhook Trigger - Appeler un webhook

- **Panneau de configuration** pour chaque action
- **Export/Import JSON** des workflows
- **Interface moderne** avec TailwindCSS

### Backend (à implémenter) 🔨
- Parser le JSON exporté
- Se connecter au serveur Matrix/Luxchat
- Exécuter les actions dans l'ordre

---

## 🚀 Démarrage Rapide

### Installation
```bash
npm install
```

### Lancer l'application
```bash
npm run dev
```

Ouvrir http://localhost:3000

---

## 📖 Utilisation

### 1. Créer un workflow

1. **Ajouter des actions** : Cliquez ou glissez-déposez depuis la palette de gauche
2. **Connecter les actions** : Tirez une ligne d'une action à une autre
3. **Configurer** : Cliquez sur une action pour ouvrir le panneau de droite

### 2. Configurer les actions

Chaque action a ses propres paramètres :
- **Create Room** : Nom, visibilité, membres
- **Send Message** : Message, format (plain/markdown/html)
- **Invite User** : ID utilisateur, ID salon
- **Wait Time** : Durée, unité (secondes/minutes/heures)
- etc.

### 3. Exporter le workflow

Cliquez sur **"Exporter"** → télécharge un fichier JSON

### 4. Exécuter (via le backend)

Le backend lit le JSON et exécute chaque action via l'API Matrix

---

## 📁 Structure du Projet

```
BISMILLAH/
├── src/
│   ├── components/          # Composants React
│   │   ├── WorkflowBuilder.tsx   # Composant principal
│   │   ├── CustomNode.tsx        # Apparence des nodes
│   │   ├── NodePalette.tsx       # Palette d'actions (gauche)
│   │   └── ConfigPanel.tsx       # Formulaires de config (droite)
│   ├── types/
│   │   └── workflow.ts           # Types TypeScript
│   └── config/
│       └── nodeTypes.ts          # Métadonnées des 7 actions
├── workflows/                # Exemples de workflows JSON
│   ├── exemple_onboarding.json
│   └── exemple_room_temporaire.json
├── README.md                 # Ce fichier
├── README_DETAILLE.md        # Documentation complète
└── BACKEND_IMPLEMENTATION.md # Guide backend
```

---

## 📦 Technologies

- **React 18** - Interface utilisateur
- **TypeScript** - Typage statique
- **ReactFlow** - Éditeur de workflow graphique
- **TailwindCSS** - Styles
- **Lucide React** - Icônes
- **Vite** - Build tool

---

## 📚 Documentation

### 📘 Guides Disponibles

1. **[GUIDE_RAPIDE.md](./GUIDE_RAPIDE.md)** ⚡  
   → Commence ici ! Explication simple en 5 minutes

2. **[README_DETAILLE.md](./README_DETAILLE.md)** 📖  
   → Documentation complète : comment tout fonctionne en détail

3. **[BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md)** 🔧  
   → Guide pour implémenter le backend (avec code complet)

4. **[workflows/](./workflows/)** 📁  
   → Exemples de workflows JSON prêts à tester

---

## 🎯 Pour le Hackathon

### Ce projet répond à **4 challenges** :

| Challenge | Solution | Node Utilisé |
|-----------|----------|--------------|
| Faciliter la création de spaces | Interface visuelle | Create Room |
| Rooms auto-destructibles | Workflow temporisé | Create → Wait → Destroy |
| Bots pédagogiques | Le builder lui-même | Tous les nodes |
| Analyse d'activité | Statistiques automatiques | Analyse Stats |

### Pourquoi ce projet va gagner ? 🏆

✅ **Réutilisable** : Pas qu'une démo, un vrai outil  
✅ **Accessible** : Les non-devs peuvent créer des automations  
✅ **Complet** : Frontend professionnel + backend simple  
✅ **Innovant** : Premier workflow builder pour Matrix  

---

## � Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 📖 Comment utiliser

### 1. Créer un workflow

1. **Ajouter des nodes** : Glissez-déposez ou cliquez sur les actions dans la palette de gauche
2. **Connecter les nodes** : Tirez une ligne depuis le point en bas d'un node vers le point en haut d'un autre
3. **Configurer** : Cliquez sur un node pour ouvrir le panneau de configuration à droite

### 2. Configurer les nodes

Chaque type de node a ses propres paramètres :

#### Create Room
- Nom du salon
- Visibilité (public/privé)
- Parent Space (optionnel)
- Liste des membres

#### Send Message
- Contenu du message
- Format (plain/markdown/html)
- Salon cible

#### Invite User
- ID utilisateur Matrix
- ID du salon

#### Wait Time
- Durée
- Unité (secondes/minutes/heures)

#### Analyse Stats
- Type de statistique
- Période d'analyse

#### Destroy Room
- ID du salon à supprimer

#### Webhook Trigger
- URL du webhook
- Méthode HTTP (GET/POST)

### 3. Exporter le workflow

Cliquez sur **"Exporter"** pour télécharger votre workflow en JSON.

Format du JSON exporté :
```json
{
  "id": "workflow-1234567890",
  "name": "Mon workflow Matrix",
  "description": "Workflow Matrix créé avec le builder",
  "nodes": [
    {
      "id": "createRoom-1234",
      "type": "createRoom",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "Create Room",
        "config": {
          "roomName": "Mon salon",
          "visibility": "private",
          "members": ["@user1:matrix.org"]
        }
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "createRoom-1234",
      "target": "sendMessage-5678"
    }
  ],
  "createdAt": "2025-11-17T...",
  "updatedAt": "2025-11-17T..."
}
```

### 4. Importer un workflow

Cliquez sur **"Importer"** et sélectionnez un fichier JSON de workflow.

## 🔧 Structure du projet

```
BISMILLAH/
├── src/
│   ├── components/
│   │   ├── WorkflowBuilder.tsx    # Composant principal
│   │   ├── CustomNode.tsx         # Node personnalisé
│   │   ├── NodePalette.tsx        # Palette d'actions
│   │   └── ConfigPanel.tsx        # Panneau de configuration
│   ├── types/
│   │   └── workflow.ts            # Types TypeScript
│   ├── config/
│   │   └── nodeTypes.ts           # Configuration des nodes
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎨 Technologies utilisées

- **React 18** - Interface utilisateur
- **TypeScript** - Typage statique
- **ReactFlow** - Éditeur de workflow graphique
- **TailwindCSS** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes
- **Vite** - Build tool rapide

## 🔄 Intégration Backend

Le JSON exporté contient toutes les informations nécessaires pour que le backend exécute le workflow :

1. **Ordre d'exécution** : Suivre les edges depuis le node initial
2. **Configuration de chaque action** : Lire le champ `config` de chaque node
3. **Type d'action** : Utiliser le champ `type` pour déterminer quelle fonction Matrix appeler

Exemple de traitement backend :
```typescript
// Pseudo-code backend
const workflow = JSON.parse(workflowJson);

for (const node of workflow.nodes) {
  switch (node.type) {
    case 'createRoom':
      await matrixClient.createRoom({
        name: node.data.config.roomName,
        visibility: node.data.config.visibility,
        // ...
      });
      break;
    
    case 'sendMessage':
      await matrixClient.sendMessage(
        node.data.config.targetRoom,
        node.data.config.message
      );
      break;
    
    // etc...
  }
}
```

## 📝 Prochaines étapes

- [ ] Validation des formulaires
- [ ] Prévisualisation du workflow
- [ ] Historique des modifications (undo/redo)
- [ ] Templates de workflows prédéfinis
- [ ] Variables et conditions
- [ ] Intégration API backend
- [ ] Mode debug avec exécution pas à pas

## 🤝 Contribution

Ce projet est un POC (Proof of Concept). N'hésitez pas à proposer des améliorations !

## 📄 License

MIT
