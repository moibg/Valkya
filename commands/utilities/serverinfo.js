const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Affiche les infos du serveur'),
  async execute(interaction) {
    const guild = interaction.guild;
    const embed = embedBuilder({
      title: '🌐 Informations serveur',
      description: `> **Nom :** ${interaction.guild.name}\n> **ID :** ${interaction.guild.id}\n> **Membres :** ${interaction.guild.memberCount}\n> **Créé le :** <t:${Math.floor(interaction.guild.createdTimestamp/1000)}:D>`,
      color: 0x5865F2,
      footer: { text: 'Commande utilitaire' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
