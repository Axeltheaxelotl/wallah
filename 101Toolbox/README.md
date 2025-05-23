# 🛠️ 101Toolbox

## 🌐 Langages Importants

### 1. Python
- Très utilisé pour écrire des scripts d'automatisation, scanners, exploits simples, outils de pentest.
- Permet d'écrire des outils personnalisés, automatiser des attaques, analyser des données.

### 2. C / C++
- Langages de bas niveau, parfaits pour comprendre et exploiter des failles mémoire (buffer overflow, format string).
- Écriture d'exploits complexes, reverse engineering, développement d'outils système.

### 3. Assembly
- Pour comprendre comment les vulnérabilités fonctionnent au niveau machine, et pour coder des payloads très bas niveau.
- Reverse engineering, développement de shellcode, analyse de malware.

### 4. JavaScript
- Pour exploiter les failles côté client (XSS, attaques web).
- Tests d'injection, manipulation DOM, exploitation des vulnérabilités web.

### 5. SQL
- Comprendre et exploiter les injections SQL.
- Injection SQL, extraction de données, manipulations de bases de données.

### 6. Bash / Shell
- Pour automatiser des tâches sur les systèmes Unix/Linux.
- Scripting d'attaque, post-exploitation, automatisation.

---

## 🔥 Attaques les plus utilisées et fonctionnelles aujourd’hui (2025)

### 1. Phishing
- **Pourquoi ?** Très facile à faire, ciblage humain, souvent efficace même avec de bonnes protections techniques.
- **Fonctionnement :** Faux mails ou sites, récupération des identifiants directement par l’humain.
- **Usage :** Voler des comptes, accès à des réseaux, ransomware.

### 2. Injection SQL
- **Pourquoi ?** Beaucoup de sites mal sécurisés, encore très courant.
- **Fonctionnement :** Injection de commandes SQL pour voler/modifier la base de données.
- **Usage :** Exfiltration de données sensibles.

### 3. Cross-Site Scripting (XSS)
- **Pourquoi ?** Failles fréquentes dans les applications web complexes.
- **Fonctionnement :** Injection de scripts JS malveillants dans les pages web, voler sessions, redirection.
- **Usage :** Voler cookies, escroquerie, propagation malware.

### 4. Buffer Overflow
- **Pourquoi ?** Moins fréquent sur les applis modernes (meilleurs langages et protections), mais encore exploité dans certains logiciels et systèmes embarqués.
- **Fonctionnement :** Écraser mémoire pour exécuter du code arbitraire.
- **Usage :** Escalade de privilèges, prise de contrôle machine.

### 5. Man In The Middle (MITM)
- **Pourquoi ?** Utilisé dans des réseaux non sécurisés (Wi-Fi publics), ou attaques ciblées.
- **Fonctionnement :** Interception et modification des communications réseau.
- **Usage :** Voler infos, modifier données en transit.


### 6. Password Cracking / Brute Force
- **Langages :** Python, C, Bash
- **Fonctionnement :** Tester massivement des combinaisons de mots de passe jusqu’à trouver le bon.
- **Utilisation :** Récupérer accès comptes protégés.

### 7. Social Engineering
- **Langages :** Aucun langage technique obligatoire (plutôt psychologie & communication)
- **Fonctionnement :** Manipuler les gens pour qu’ils donnent accès, info ou droits.
- **Utilisation :** Accès physique, info confidentielle.

### 8. Exploitation de vulnérabilités logicielles (Exploits)
- **Langages :** C, C++, Assembleur
- **Fonctionnement :** Trouver bugs dans logiciels, coder exploit pour prendre contrôle.
- **Utilisation :** Prise de contrôle, pivot réseau.

### 9. Malware (Virus, Trojans, Worms)
- **Langages :** C, C++, Python, Go
- **Fonctionnement :** Logiciel malveillant qui infecte et propage.
- **Utilisation :** Vol de données, sabotage, ransom.

### 10. Cryptojacking
- **Langages :** JavaScript, C++
- **Fonctionnement :** Utiliser la puissance CPU/GPU d’un système à son insu pour miner des cryptomonnaies.
- **Utilisation :** Profit illégal sans consentement.

### 11. Attaques sur IoT
- **Langages :** C, Python, Assembleur
- **Fonctionnement :** Exploiter failles dans objets connectés souvent peu sécurisés.
- **Utilisation :** Prise de contrôle, création botnet (ex: Mirai).

### 12. Attaques DDoS (Distributed Denial of Service)
- **Langages :** Python, Go, C++
- **Fonctionnement :** Inonder un serveur/site avec un trafic massif pour le rendre indisponible.
- **Utilisation :** Sabotage, pression.

---

## 😈 Hack "pour embêter" ou détruire (sans vol)

Il existe des attaques ou hacks qui ne visent pas à voler des données, mais plutôt à perturber, saboter ou simplement embêter la victime. Voici quelques exemples :

### 1. Trollware / Prankware
- **But :** Faire des blagues, perturber l'utilisateur sans causer de vrais dégâts (ex : inverser les touches clavier, changer le fond d'écran, ouvrir des fenêtres en boucle).
- **Exemples :** Scripts qui font bouger la souris, changent les sons système, affichent des messages absurdes.

### 2. Wiper (Destruction de données)
- **But :** Détruire ou effacer des fichiers, rendre le système inutilisable.
- **Exemples :** Malware qui supprime le MBR, efface le disque dur, corrompt des fichiers importants.

### 3. Logiciels de sabotage
- **But :** Rendre un service ou un système inutilisable sans voler d'informations.
- **Exemples :** Modifier la configuration réseau, désactiver des services critiques, remplir le disque de fichiers inutiles.

### 4. DDoS (Déni de service)
- **But :** Rendre un site ou un service indisponible en le saturant de requêtes.
- **Exemples :** Botnets qui inondent un serveur de trafic.

### 5. Defacement
- **But :** Modifier l'apparence d'un site web pour faire passer un message ou ridiculiser la victime.
- **Exemples :** Changer la page d'accueil d'un site piraté.

### 6. Logiciels de nuisance
- **But :** Gêner l'utilisateur sans forcément détruire ou voler.
- **Exemples :** Fenêtres pop-up incessantes, ralentissement volontaire du système, bruitages aléatoires.

---

## 📝 Récapitulatif des attaques

| Attaque                | Usage actuel      | Facilité d’exploitation | Impact principal           |
|------------------------|------------------|------------------------|----------------------------|
| Phishing               | Très courant     | Très facile            | Vol d’identifiants         |
| Injection SQL          | Très courant     | Moyen                  | Vol/modification données   |
| XSS                    | Très courant     | Moyen                  | Voler cookies, escroquerie, propagation malware |
| Buffer Overflow        | Moins courant    | Difficile              | Escalade de privilèges, prise de contrôle machine |
| MITM                   | Moyennement courant | Moyen               | Voler infos, modifier données en transit |
| Password Cracking      | Très courant     | Facile à moyen         | Récupérer accès comptes protégés |
| Social Engineering     | Très courant     | Facile                 | Accès infos ou physique    |
| Exploits               | Variable         | Difficile              | Prise de contrôle, pivot réseau |
| Malware                | Très courant     | Variable               | Vol de données, sabotage, ransom |
| Cryptojacking          | En hausse        | Facile                 | Utilisation non autorisée de la puissance de calcul |
| IoT Attaques           | En hausse        | Moyen                  | Prise de contrôle, création botnet |
| DDoS                   | Très courant     | Moyen                  | Sabotage site/service      |

---