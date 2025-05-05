const { SlashCommandBuilder } = require('discord.js');
const XP = require('../../models/XP');
const embedBuilder = require('../../utils/embedBuilder');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Classement des niveaux du serveur'),
  async execute(interaction) {
    const top = await XP.find({ guildId: interaction.guild.id }).sort({ level: -1, xp: -1 }).limit(10);
    const desc = top.map((u, i) => `\`${i+1}.\` <@${u.userId}> — **Niveau ${u.level}** (${u.xp} XP)`).join('\n');
    const embed = embedBuilder({
      title: '🏆 Leaderboard XP',
      description: desc || 'Aucun membre classé.',
      color: 0xFEE75C,
      footer: { text: 'Système de niveaux' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
