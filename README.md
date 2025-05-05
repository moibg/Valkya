# Valkya 2.0 - Bot multi-tools en cours de developpement

## Fonctionnalités principales
- Modération complète (ban, kick, mute, warn, clear, purge, antiraid, slowmode, tempban, lock, unlock, give/remove role...)
- Système d'avertissements avec base de données
- Configuration serveur (welcome, setup...)
- Tickets de support avec panel et gestion automatique
- Utilitaires (ping, stats, help, userinfo, serverinfo, reminder, logs...)
- Embeds esthétiques pour toutes les réponses
- Gestion des permissions et des erreurs

## Installation
1. Clone le repo ou copie les fichiers dans un dossier
2. Installe les dépendances :
   ```bash
   npm install
   ```
3. Crée un fichier `.env` à la racine avec :
   ```env
   TOKEN=ton_token_discord
   MONGODB_URI=ton_url_mongodb
   ```
4. Lance le bot :
   ```bash
   npm start
   ```

## Structure du projet
- `index.js` : point d'entrée, gestion du client, MongoDB, chargement dynamique
- `commands/` : toutes les commandes classées par catégorie
- `events/` : gestion des events Discord (ready, interaction, etc.)
- `models/` : schémas Mongoose pour la config serveur et les warnings
- `utils/` : utilitaires (ex: embedBuilder)

## Ajout de commandes
Ajoute un fichier JS dans le dossier approprié de `commands/` avec la structure :
```js
module.exports = {
  data: new SlashCommandBuilder()...,
  async execute(interaction, client) {
    // ...
  }
}
```

## Support
Pour toute question, ouvre un ticket sur le serveur Discord du projet (https//discord.gg/valkya) ou contacte le développeur 'one_day_.'.
