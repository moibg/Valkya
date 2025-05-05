const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Envoie un meme aléatoire !'),
  async execute(interaction) {
    const res = await fetch('https://meme-api.com/gimme');
    const data = await res.json();
    const embed = embedBuilder({
      title: data.title || 'Meme',
      image: data.url,
      color: 0x5865F2,
      footer: { text: `👍 ${data.ups || 0}` }
    });
    await interaction.reply({ embeds: [embed] });
  }
};