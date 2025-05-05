// Centralise l'importation de toutes les commandes des sous-dossiers
const fs = require('fs');
const path = require('path');

const commandFolders = ['configuration', 'moderation', 'ticket', 'utilities'];
const commands = [];

for (const folder of commandFolders) {
  const folderPath = path.join(__dirname, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    commands.push(command);
  }
}

module.exports = commands;
