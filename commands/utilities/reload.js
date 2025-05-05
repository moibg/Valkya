const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Recharge toutes les commandes (admin)'),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🔄 Permission refusée',
        description: 'Vous devez être administrateur.',
        color: 0x5865F2,
        footer: { text: 'Commande utilitaire' }
      })], flags: 64 });
    }
    client.commands.clear();
    const fs = require('fs');
    const path = require('path');
    function loadCommands(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const stat = fs.lstatSync(path.join(dir, file));
        if (stat.isDirectory()) {
          loadCommands(path.join(dir, file));
        } else if (file.endsWith('.js')) {
          const command = require(path.join(dir, file));
          if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
          }
        }
      }
    }
    loadCommands(path.join(__dirname, '../'));
    await interaction.reply({ embeds: [embedBuilder({
      title: '🔄 Reload',
      description: 'Toutes les commandes ont été rechargées.',
      color: 0x57F287,
      footer: { text: 'Commande utilitaire' }
    })], flags: 64 });
  }
};
