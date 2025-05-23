---

## 5. Comment cacher du code malveillant dans une image ou un document ?

Les hackers utilisent différentes techniques pour dissimuler du code malveillant dans des fichiers apparemment inoffensifs, comme des images ou des documents. Voici comment cela fonctionne :

### A. Stéganographie (dans les images)
- **Principe :** Cacher des données (texte, script, exécutable) dans les pixels d’une image sans modifier visuellement l’image.
- **Comment ?** Le code est inséré dans les bits de moindre poids (LSB) de chaque pixel, ou ajouté à la fin du fichier image.
- **Utilisation :** Un programme spécial extrait et exécute le code caché. Parfois, l’image sert juste de "porteuse" pour transmettre un malware ou des instructions à un autre logiciel malveillant déjà présent sur la machine.

### B. Macros malveillantes (dans les documents Office)
- **Principe :** Les fichiers Word, Excel, etc. peuvent contenir des macros (petits programmes en VBA).
- **Comment ?** L’attaquant envoie un document avec une macro cachée qui s’exécute à l’ouverture ou à l’activation du contenu.
- **Utilisation :** La macro télécharge et exécute un malware, vole des données, ou ouvre une porte dérobée.

### C. Exploits de vulnérabilités (dans PDF, DOC, etc.)
- **Principe :** Profiter de failles dans les logiciels de lecture (Adobe Reader, Word, etc.).
- **Comment ?** Le fichier contient un code spécialement conçu pour exploiter une faille et exécuter du code à l’ouverture.
- **Utilisation :** Installer un spyware, un ransomware, ou prendre le contrôle de la machine.

### D. Fichiers polyglottes
- **Principe :** Un même fichier est valide pour plusieurs formats (ex : image + exécutable).
- **Comment ?** Le fichier est structuré pour être interprété différemment selon le programme qui l’ouvre.
- **Utilisation :** Un fichier .jpg qui est aussi un .exe sous Windows, par exemple.

### E. Scripts cachés dans les métadonnées
- **Principe :** Les métadonnées (infos cachées dans les fichiers) peuvent contenir du code ou des liens malveillants.
- **Comment ?** Un script ou une commande est caché dans les propriétés du fichier.
- **Utilisation :** Un autre malware lit et exécute ce code.

---

### Que mettent-ils dedans ?

- **Payloads** : Un petit programme qui télécharge et exécute le vrai malware.
- **Shellcode** : Code permettant de prendre le contrôle du système.
- **Commandes** : Instructions pour un malware déjà présent (ex : adresse d’un serveur C2).
- **Scripts** : Code en VBA, JavaScript, PowerShell, Bash, etc.

---