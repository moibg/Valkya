const { SlashCommandBuilder } = require('discord.js');
const Economy = require('../../models/Economy');
const embedBuilder = require('../../utils/embedBuilder');
const { getLang } = require('../../utils/lang');
const cooldown = new Map();
module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Récupère ta récompense quotidienne'),
  async execute(interaction) {
    const lang = getLang(interaction);
    if (cooldown.has(interaction.user.id)) {
      return interaction.reply({ content: lang.dailyCooldown, ephemeral: true });
    }
    const eco = await Economy.findOneAndUpdate(
      { guildId: interaction.guild.id, userId: interaction.user.id },
      { $inc: { coins: 200 } },
      { upsert: true, new: true }
    );
    cooldown.set(interaction.user.id, true);
    setTimeout(() => cooldown.delete(interaction.user.id), 24 * 60 * 60 * 1000);
    const embed = embedBuilder({
      title: lang.dailyTitle,
      description: lang.daily(200, eco.coins),
      color: 0x57F287,
      footer: { text: lang.dailyFooter }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
