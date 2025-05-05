const { SlashCommandBuilder } = require('discord.js');
const Economy = require('../../models/Economy');
const embedBuilder = require('../../utils/embedBuilder');
const { getLang } = require('../../utils/lang');

const SHOP_ITEMS = [
  { name: 'Ticket de loterie', price: 500, description: 'Tente ta chance à la loterie !' },
  { name: 'Badge VIP', price: 2000, description: 'Montre ton statut VIP.' },
  { name: 'Rôle Couleur', price: 1000, description: 'Un rôle couleur personnalisé.' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Affiche la boutique du serveur'),
  async execute(interaction) {
    const lang = getLang(interaction);
    const embed = embedBuilder({
      title: '🛒 Boutique',
      description: SHOP_ITEMS.map((item, i) => `**${i+1}. ${item.name}**\nPrix : ${item.price} coins\n${item.description}`).join('\n\n'),
      color: 0xFEE75C,
      footer: { text: 'Utilise /buy <numéro> pour acheter.' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};