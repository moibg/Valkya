const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gif')
    .setDescription('Envoie un gif aléatoire !'),
  async execute(interaction) {
    const res = await fetch('https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC');
    const data = await res.json();
    const url = data.data?.images?.original?.url;
    const embed = embedBuilder({
      title: '🎬 Gif aléatoire',
      image: url,
      color: 0xFEE75C
    });
    await interaction.reply({ embeds: [embed] });
  }
};