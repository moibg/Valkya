const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const { getLang } = require('../../utils/lang');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Créer un sondage')
    .addStringOption(opt => opt.setName('question').setDescription('Question du sondage').setRequired(true)),
  async execute(interaction) {
    const lang = getLang(interaction);
    const question = interaction.options.getString('question');
    const embed = embedBuilder({
      title: '📊 Sondage',
      description: question,
      color: 0xFEE75C,
      footer: { text: `Par ${interaction.user.tag}` }
    });
    const msg = await interaction.channel.send({ embeds: [embed] });
    await msg.react('✅');
    await msg.react('❌');
    await interaction.reply({ content: lang.pollCreated, ephemeral: true });
  }
};
