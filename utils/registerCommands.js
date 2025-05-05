const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function registerCommands(client) {
  const commands = [];

  function collectCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const stat = fs.lstatSync(path.join(dir, file));
      if (stat.isDirectory()) {
        collectCommands(path.join(dir, file));
      } else if (file.endsWith('.js')) {
        const command = require(path.join(dir, file));
        if (command.data) {
          commands.push(command.data.toJSON());
        }
      }
    }
  }

  collectCommands(path.join(__dirname, '../commands'));

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    const guilds = await client.guilds.fetch();

    console.log('🗑️ Suppression des commandes slash sur toutes les guildes...');
    for (const [guildId] of guilds) {
      try {
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
          { body: [] }
        );
        console.log(`✅ Anciennes commandes supprimées pour la guilde ${guildId}`);
        await new Promise(res => setTimeout(res, 1000));
      } catch (error) {
        console.error(`❌ Erreur lors de la suppression des commandes pour la guilde ${guildId}:`, error.message);
      }
    }

    console.log('➕ Enregistrement des nouvelles commandes slash (guildes)...');
    for (const [guildId] of guilds) {
      try {
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
          { body: commands }
        );
        console.log(`✅ Commandes enregistrées pour la guilde ${guildId}`);
        await new Promise(res => setTimeout(res, 1000));
      } catch (error) {
        console.error(`❌ Erreur lors de l’enregistrement des commandes pour la guilde ${guildId}:`, error.message);
      }
    }

    console.log('🎉 Commandes slash mises à jour avec succès !');

  } catch (error) {
    console.error('🚨 Erreur critique lors de la synchronisation des commandes :', error);
  }
}

module.exports = registerCommands;
