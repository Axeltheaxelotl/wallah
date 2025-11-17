#!/usr/bin/env python3
"""
DÉMONSTRATION : Comment le Backend Utilise Ton JSON

Ce script montre EXACTEMENT comment Timo va utiliser
le fichier demo_hackathon.json que tu as créé.
"""

import json

print("=" * 60)
print("🔥 DÉMONSTRATION : Le JSON EST Utilisé !")
print("=" * 60)

# 1️⃣ ÉTAPE 1 : Lire le JSON (ce que tu as créé)
print("\n📖 ÉTAPE 1 : Lire le fichier JSON...")
print("-" * 60)

with open('workflows/demo_hackathon.json', 'r', encoding='utf-8') as f:
    workflow = json.load(f)

print(f"✅ JSON chargé avec succès !")
print(f"   Nom du workflow: {workflow['name']}")
print(f"   Nombre d'actions: {len(workflow['nodes'])}")
print(f"   Nombre de connexions: {len(workflow['edges'])}")

# 2️⃣ ÉTAPE 2 : Afficher les actions (ce que tu as configuré)
print("\n📋 ÉTAPE 2 : Voir toutes les actions...")
print("-" * 60)

for i, node in enumerate(workflow['nodes'], 1):
    print(f"\n{i}. {node['data']['label']}")
    print(f"   Type: {node['type']}")
    print(f"   Config: {node['data']['config']}")

# 3️⃣ ÉTAPE 3 : Simuler l'exécution
print("\n⚡ ÉTAPE 3 : Simuler l'exécution...")
print("-" * 60)

context = {}

for node in workflow['nodes']:
    node_type = node['type']
    config = node['data']['config']
    label = node['data']['label']
    
    print(f"\n🔹 Exécution: {label}")
    
    if node_type == 'createRoom':
        room_name = config['roomName']
        visibility = config['visibility']
        print(f"   → Création du salon: '{room_name}'")
        print(f"   → Visibilité: {visibility}")
        # Simulation
        fake_room_id = "!abc123:luxchat.lu"
        context['last_room_id'] = fake_room_id
        print(f"   ✅ Salon créé (simulé): {fake_room_id}")
    
    elif node_type == 'sendMessage':
        message = config['message']
        format_type = config['format']
        room_id = config.get('targetRoom') or context.get('last_room_id')
        print(f"   → Envoi du message dans: {room_id}")
        print(f"   → Message: {message[:50]}...")
        print(f"   → Format: {format_type}")
        print(f"   ✅ Message envoyé (simulé)")
    
    elif node_type == 'inviteUser':
        user_id = config['userId']
        room_id = config.get('roomId') or context.get('last_room_id')
        print(f"   → Invitation de: {user_id}")
        print(f"   → Dans le salon: {room_id}")
        print(f"   ✅ Utilisateur invité (simulé)")
    
    elif node_type == 'waitTime':
        duration = config['duration']
        unit = config['unit']
        print(f"   → Attente de: {duration} {unit}")
        print(f"   ✅ Pause effectuée (simulé)")
    
    elif node_type == 'analyseStats':
        stats_type = config['statsType']
        time_range = config['timeRange']
        print(f"   → Analyse: {stats_type}")
        print(f"   → Période: {time_range}")
        print(f"   ✅ Stats récupérées (simulé)")

# 4️⃣ ÉTAPE 4 : Afficher l'ordre d'exécution
print("\n🔗 ÉTAPE 4 : Ordre d'exécution (depuis les edges)...")
print("-" * 60)

for i, edge in enumerate(workflow['edges'], 1):
    source = edge['source']
    target = edge['target']
    
    # Trouver les labels
    source_label = next(n['data']['label'] for n in workflow['nodes'] if n['id'] == source)
    target_label = next(n['data']['label'] for n in workflow['nodes'] if n['id'] == target)
    
    print(f"{i}. {source_label} → {target_label}")

# 5️⃣ CONCLUSION
print("\n" + "=" * 60)
print("✅ CONCLUSION")
print("=" * 60)
print("""
Le fichier JSON demo_hackathon.json contient TOUTES les informations :
- Les actions à exécuter
- Leur configuration (nom du salon, message, etc.)
- L'ordre d'exécution

Le backend (Python) LIT ce JSON et EXÉCUTE tout automatiquement.

Tu crées visuellement → JSON est généré → Backend l'utilise → Magic !
""")

print("\n🎯 Le JSON est ESSENTIEL pour faire le lien entre:")
print("   Frontend (toi) ←→ JSON ←→ Backend (Timo) ←→ Luxchat")
print("\n" + "=" * 60)
