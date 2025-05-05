const { SlashCommandBuilder } = require('discord.js');
const Economy = require('../../models/Economy');
const embedBuilder = require('../../utils/embedBuilder');
const { getLang } = require('../../utils/lang');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Affiche ton inventaire'),
  async execute(interaction) {
    const lang = getLang(interaction);
    const eco = await Economy.findOne({ guildId: interaction.guild.id, userId: interaction.user.id }) || { inventory: [] };
    const items = eco.inventory && eco.inventory.length ? eco.inventory.map((item, i) => `\`${i+1}.\` ${item}`).join('\n') : 'Inventaire vide.';
    const embed = embedBuilder({
      title: '🎒 Inventaire',
      description: items,
      color: 0xFEE75C
    });
    await interaction.reply({ embeds: [embed] });
  }
};