const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('Crée un rappel')
    .addStringOption(option => option.setName('texte').setDescription('Texte du rappel').setRequired(true))
    .addIntegerOption(option => option.setName('minutes').setDescription('Dans combien de minutes ?').setRequired(true)),
  async execute(interaction) {
    const texte = interaction.options.getString('texte');
    const minutes = interaction.options.getInteger('minutes');
    const embed = embedBuilder({
      title: '⏰ Rappel programmé',
      description: `Je te rappellerai : **${texte}** dans ${minutes} minute(s).`,
      color: 0xFEE75C,
      footer: { text: 'Commande utilitaire' }
    });
    await interaction.reply({ embeds: [embed], flags: 64 });
    setTimeout(() => {
      interaction.user.send({ embeds: [embedBuilder({
        title: '⏰ Rappel',
        description: texte,
        color: 0xFEE75C,
        footer: { text: 'Commande utilitaire' }
      })] });
    }, minutes * 60 * 1000);
  }
};
