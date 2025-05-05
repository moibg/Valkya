const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('showlogs')
    .setDescription('Affiche les logs récents du serveur'),
  async execute(interaction) {
    const embed = embedBuilder({
      title: '📜 Logs',
      description: 'Affichage des logs du serveur (fonctionnalité à compléter selon besoins).',
      color: 0x5865F2,
      footer: { text: 'Commande utilitaire' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
