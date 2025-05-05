const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Affiche les infos d\'un utilisateur')
    .addUserOption(option => option.setName('membre').setDescription('Utilisateur à afficher').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('membre') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    const embed = embedBuilder({
      title: '👤 Informations utilisateur',
      description: `> **Pseudo :** ${interaction.user.tag}\n> **ID :** ${interaction.user.id}\n> **Créé le :** <t:${Math.floor(interaction.user.createdTimestamp/1000)}:D>`,
      color: 0x5865F2,
      footer: { text: 'Commande utilitaire' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
