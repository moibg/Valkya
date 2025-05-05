const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Affiche les infos du bot'),
  async execute(interaction, client) {
    const embed = embedBuilder({
      title: '🤖 Informations du bot',
      description: `Développé par OneDay ? : ${client.guilds.cache.size}\nUtilisateurs : ${client.users.cache.size}`,
      color: 0x5865F2,
      footer: { text: 'Commande utilitaire' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
