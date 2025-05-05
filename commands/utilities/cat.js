const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Envoie une image de chat aléatoire !'),
  async execute(interaction) {
    const res = await fetch('https://api.thecatapi.com/v1/images/search');
    const data = await res.json();
    const image = data[0]?.url;
    const embed = embedBuilder({
      title: '🐱 Miaou !',
      image,
      color: 0xFEE75C
    });
    await interaction.reply({ embeds: [embed] });
  }
};