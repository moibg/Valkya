const { SlashCommandBuilder } = require('discord.js');
const Economy = require('../../models/Economy');
const embedBuilder = require('../../utils/embedBuilder');
const { getLang } = require('../../utils/lang');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Affiche ton solde')
    .addUserOption(opt => opt.setName('membre').setDescription('Voir le solde de...')),
  async execute(interaction) {
    const lang = getLang(interaction);
    const user = interaction.options.getUser('membre') || interaction.user;
    const eco = await Economy.findOne({ guildId: interaction.guild.id, userId: user.id }) || { coins: 0 };
    const embed = embedBuilder({
      title: lang.balanceTitle ? lang.balanceTitle(user.username) : `💰 ${lang.balance(user.username, eco.coins).split('\n')[0]}`,
      description: lang.balance(user.username, eco.coins).split('\n').slice(1).join('\n'),
      color: 0xFEE75C,
      footer: { text: lang.balanceFooter }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
