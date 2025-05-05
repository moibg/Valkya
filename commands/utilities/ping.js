const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Affiche la latence du bot'),
  async execute(interaction) {
    const embed = embedBuilder({
      title: '🏓 Pong !',
      description: `Latence : **${Date.now() - interaction.createdTimestamp}ms**`,
      color: 0x5865F2,
      footer: { text: 'Commande utilitaire' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
