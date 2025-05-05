const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Envoie une image de chien aléatoire !'),
  async execute(interaction) {
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();
    const image = data.message;
    const embed = embedBuilder({
      title: '🐶 Wouf !',
      image,
      color: 0x57F287
    });
    await interaction.reply({ embeds: [embed] });
  }
};