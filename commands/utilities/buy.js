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
    .setName('buy')
    .setDescription('Achète un objet dans la boutique')
    .addIntegerOption(opt => opt.setName('item').setDescription('Numéro de l\'objet').setRequired(true)),
  async execute(interaction) {
    const lang = getLang(interaction);
    const itemIndex = interaction.options.getInteger('item') - 1;
    if (itemIndex < 0 || itemIndex >= SHOP_ITEMS.length) {
      return interaction.reply({ content: 'Numéro d\'objet invalide.', ephemeral: true });
    }
    const item = SHOP_ITEMS[itemIndex];
    const eco = await Economy.findOne({ guildId: interaction.guild.id, userId: interaction.user.id }) || { coins: 0, inventory: [] };
    if (eco.coins < item.price) {
      return interaction.reply({ content: 'Solde insuffisant.', ephemeral: true });
    }
    await Economy.findOneAndUpdate(
      { guildId: interaction.guild.id, userId: interaction.user.id },
      { $inc: { coins: -item.price }, $push: { inventory: item.name } },
      { upsert: true }
    );
    const embed = embedBuilder({
      title: '✅ Achat effectué',
      description: `Tu as acheté **${item.name}** pour ${item.price} coins !`,
      color: 0x57F287
    });
    await interaction.reply({ embeds: [embed] });
  }
};