const { SlashCommandBuilder } = require('discord.js');
const XP = require('../../models/XP');
const embedBuilder = require('../../utils/embedBuilder');
const { getLang } = require('../../utils/lang');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Affiche ton niveau et ton XP')
    .addUserOption(opt => opt.setName('membre').setDescription('Voir le niveau de...')),
  async execute(interaction) {
    const lang = getLang(interaction);
    const user = interaction.options.getUser('membre') || interaction.user;
    const userXP = await XP.findOne({ guildId: interaction.guild.id, userId: user.id }) || { xp: 0, level: 1 };
    const embed = embedBuilder({
      title: `🏅 Niveau de ${user.username}`,
      description: `> **Niveau :** ${userXP.level}\n> **XP :** ${userXP.xp}`,
      color: 0xFEE75C,
      footer: { text: 'Système de niveaux' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
