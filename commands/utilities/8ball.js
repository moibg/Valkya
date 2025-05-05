const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const responses = [
  'Oui', 'Non', 'Peut-être', 'Certainement', 'Jamais', 'Demande plus tard', 'Probablement', 'Impossible'
];
module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Pose une question à la boule magique')
    .addStringOption(opt => opt.setName('question').setDescription('Ta question').setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const answer = responses[Math.floor(Math.random() * responses.length)];
    const embed = embedBuilder({
      title: '🎱 8ball',
      description: `**Question :** ${question}\n**Réponse :** ${answer}`,
      color: 0x5865F2
    });
    await interaction.reply({ embeds: [embed] });
  }
};
