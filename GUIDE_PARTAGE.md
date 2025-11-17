# 🔄 Guide de Partage des Workflows

## Pour les Utilisateurs Non-Techniques ("Guiguis")

### 📤 Comment Partager ton Workflow

#### Méthode 1 : Export/Import (Super Simple)

**1. Tu as créé un workflow cool ? Partage-le !**
```
1️⃣ Clique sur le bouton "Exporter" (en haut à droite)
2️⃣ Un fichier .json est téléchargé automatiquement
3️⃣ Envoie ce fichier à tes collègues (par email, chat, etc.)
```

**2. Ton collègue reçoit le fichier**
```
1️⃣ Il clique sur "Importer"
2️⃣ Il glisse-dépose le fichier .json dans la zone
3️⃣ BOOM ! 💥 Le workflow apparaît exactement pareil
```

#### Méthode 2 : Templates Prédéfinis (Encore Plus Simple !)

**Tu débutes ? Utilise un template !**
```
1️⃣ Clique sur "Templates" (bouton violet)
2️⃣ Choisis un modèle (Onboarding, Salon Temporaire, etc.)
3️⃣ Clique dessus → Le workflow se charge automatiquement
4️⃣ Personnalise-le à ta sauce !
```

#### Méthode 3 : Dupliquer (Pour Tester)

**Tu veux tester une variante sans casser l'original ?**
```
1️⃣ Crée ton workflow
2️⃣ Clique sur "Dupliquer"
3️⃣ Une copie est créée avec "(Copie)" dans le nom
4️⃣ Modifie la copie sans risque !
```

---

## 🎯 Cas d'Usage Réels

### Scenario 1 : Onboarding d'Équipe
**Problème :** Tu dois accueillir 10 nouveaux membres, créer leurs salons, envoyer des messages de bienvenue...

**Solution :**
```
1. Clique "Templates" → "Onboarding Automatique"
2. Personnalise le message de bienvenue
3. Clique "Exporter" → Envoie le .json à ton manager
4. Il peut réutiliser le même workflow pour les prochains !
```

### Scenario 2 : Salons Temporaires pour Réunions
**Problème :** Chaque réunion, tu dois créer un salon, inviter les gens, puis le supprimer après.

**Solution :**
```
1. Utilise le template "Salon Temporaire"
2. Change la durée (1h, 2h, 1 jour...)
3. Exporte-le
4. Réutilise le même workflow pour toutes tes réunions !
```

### Scenario 3 : Notifications Webhook
**Problème :** Tu veux recevoir des alertes d'un autre système dans Matrix.

**Solution :**
```
1. Template "Notification Webhook"
2. Colle l'URL de ton webhook
3. Partage le .json avec toute l'équipe IT
4. Tout le monde a le même système de notifications !
```

---

## 📁 Format du Fichier JSON

**C'est quoi ce fichier .json ?**

C'est juste une **recette de cuisine** pour ton workflow ! Il contient :
- Le nom du workflow
- Toutes les actions (nodes)
- L'ordre d'exécution (edges)
- Les configurations de chaque action

**Exemple :**
```json
{
  "name": "Mon Super Workflow",
  "nodes": [
    {
      "id": "create-1",
      "type": "createRoom",
      "data": {
        "label": "Créer Salon",
        "config": {
          "roomName": "Bienvenue 👋"
        }
      }
    }
  ],
  "edges": []
}
```

---

## 🔒 Sécurité & Bonnes Pratiques

### ⚠️ Attention aux Données Sensibles !

**AVANT d'exporter un workflow :**
```
❌ NE PAS inclure :
   - Mots de passe
   - Tokens d'authentification
   - Informations personnelles (emails privés)

✅ Tu peux inclure :
   - La structure du workflow
   - Les noms de salons
   - Les types d'actions
   - Les délais d'attente
```

**Astuce :** Si un workflow contient des données sensibles, demande à ton collègue de les remplacer après l'import !

---

## 🚀 Workflow de Collaboration en Équipe

### Exemple : Équipe de 4 personnes au Hackathon

**Bryan (Frontend)** 
```
→ Crée l'interface visuelle
→ Teste avec des templates
→ Exporte "workflow_demo.json"
```

**Timo (Backend)**
```
→ Import "workflow_demo.json"
→ Implémente l'exécution
→ Teste avec les mêmes données
```

**Matheus (DevOps)**
```
→ Import "workflow_demo.json"
→ Déploie en prod
→ Export "workflow_prod.json" avec configs prod
```

**Smasse (QA)**
```
→ Import tous les .json
→ Teste chaque version
→ Crée "workflow_test.json" pour les tests
```

**Résultat :** Tout le monde travaille sur les mêmes workflows ! 🎉

---

## 💡 Astuces Pro

### 1. Nommer tes Exports
```
Mauvais : workflow.json
Bon    : onboarding_v1.json
Meilleur : workflow_onboarding_2025-11-18_v1.json
```

### 2. Versionner tes Workflows
```
v1 → Version initiale
v2 → Ajout de stats
v3 → Ajout d'auto-destruction
```

### 3. Créer une Bibliothèque d'Équipe
```
📁 workflows/
  ├── onboarding_v2.json
  ├── reunions_hebdo_v1.json
  ├── alertes_production_v3.json
  └── cleanup_daily_v1.json
```

Mets ça dans un dossier partagé (Google Drive, Git, etc.) !

### 4. Documenter tes Workflows
Ajoute un README.txt avec chaque .json :
```
Nom: Onboarding Automatique v2
Créé par: Bryan
Date: 2025-11-18
But: Accueillir les nouveaux membres
Fréquence: Chaque lundi

Configuration requise:
- Modifier le nom du salon (ligne 8)
- Changer les @mentions (ligne 15)
```

---

## 🆘 Dépannage

### "Le fichier ne s'importe pas !"
```
✓ Vérifie que c'est bien un .json (pas .txt)
✓ Ouvre le fichier avec un éditeur de texte
✓ Vérifie qu'il commence par { et finit par }
✓ Regénère-le depuis l'export si besoin
```

### "Les configurations sont vides !"
```
→ Normal ! Le .json contient la STRUCTURE, pas les données sensibles
→ Remplis les champs après l'import
```

### "Ça dit 'Format invalide' !"
```
→ Le fichier est peut-être corrompu
→ Redemande l'original à celui qui l'a créé
→ Ou utilise un template prédéfini à la place
```

---

## 🎓 En Résumé

**Pour Partager :**
1. Crée ton workflow
2. Clique "Exporter"
3. Envoie le .json

**Pour Recevoir :**
1. Reçois le .json
2. Clique "Importer"
3. Glisse-dépose le fichier

**C'est tout ! 🎉**

---

**Questions ? Besoin d'aide ?**
Demande à Bryan, il a créé cette interface ! 😎

*Dernière mise à jour : 17 novembre 2025*
