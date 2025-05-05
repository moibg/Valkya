const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const { getLang } = require('../../utils/lang');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Fais une suggestion')
    .addStringOption(opt => opt.setName('texte').setDescription('Suggestion').setRequired(true)),
  async execute(interaction) {
    const lang = getLang(interaction);
    const texte = interaction.options.getString('texte');
    const embed = embedBuilder({
      title: '💡 Nouvelle suggestion',
      description: texte,
      color: 0x5865F2,
      footer: { text: `Par ${interaction.user.tag}` }
    });
    const msg = await interaction.channel.send({ embeds: [embed] });
    await msg.react('👍');
    await msg.react('👎');
    await interaction.reply({ content: lang.suggestSent, ephemeral: true });
  }
};
