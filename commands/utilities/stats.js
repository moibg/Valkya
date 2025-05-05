const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Affiche les statistiques du bot'),
  async execute(interaction, client) {
    const embed = embedBuilder({
      title: '📈 Statistiques',
      description: `> **Serveurs :** ${client.guilds.cache.size}\n> **Utilisateurs :** ${client.users.cache.size}`,
      color: 0x5865F2,
      footer: { text: 'Commande utilitaire' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
