const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Pile ou face'),
  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Pile' : 'Face';
    const embed = embedBuilder({
      title: '🪙 Pile ou Face',
      description: `Résultat : **${result}**`,
      color: 0xFEE75C
    });
    await interaction.reply({ embeds: [embed] });
  }
};
