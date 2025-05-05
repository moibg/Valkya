const { SlashCommandBuilder } = require('discord.js');
const Economy = require('../../models/Economy');
const { getLang } = require('../../utils/lang');
const { replyEmbed, replyError } = require('../../utils/utilities');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Donne des coins à un membre')
    .addUserOption(opt => opt.setName('membre').setDescription('Destinataire').setRequired(true))
    .addIntegerOption(opt => opt.setName('montant').setDescription('Montant à donner').setRequired(true)),
  async execute(interaction) {
    const lang = getLang(interaction);
    const from = interaction.user;
    const to = interaction.options.getUser('membre');
    const amount = interaction.options.getInteger('montant');
    if (!to || to.bot || to.id === from.id) return replyError(interaction, lang.invalidAmount);
    if (!amount || amount <= 0) return replyError(interaction, lang.invalidAmount);
    const fromEco = await Economy.findOne({ guildId: interaction.guild.id, userId: from.id }) || { coins: 0 };
    if (fromEco.coins < amount) return replyError(interaction, lang.insufficientBalance);
    await Economy.findOneAndUpdate(
      { guildId: interaction.guild.id, userId: from.id },
      { $inc: { coins: -amount } },
      { upsert: true }
    );
    await Economy.findOneAndUpdate(
      { guildId: interaction.guild.id, userId: to.id },
      { $inc: { coins: amount } },
      { upsert: true }
    );
    await replyEmbed(interaction, {
      title: lang.paymentTitle,
      description: lang.pay(`<@${from.id}>`, `<@${to.id}>`, amount),
      color: 0x57F287,
      footer: { text: lang.paymentFooter }
    });
  }
};
