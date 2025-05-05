const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Affiche le statut du bot'),
  async execute(interaction, client) {
    const embed = embedBuilder({
      title: '🟢 Statut du bot',
      description: `> **Statut :** En ligne\n> **Ping :** ${client.ws.ping}ms`,
      color: 0x57F287,
      footer: { text: 'Commande utilitaire' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
