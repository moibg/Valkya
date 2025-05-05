const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Active le slowmode sur le salon')
    .addIntegerOption(option => option.setName('secondes').setDescription('Durée en secondes').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Permission refusée',
        description: 'Vous devez avoir la permission de gérer les salons.',
        color: 0xED4245,
        footer: { text: 'Commande de modération' }
      })], flags: 64 });
    }
    const secondes = interaction.options.getInteger('secondes');
    await interaction.channel.setRateLimitPerUser(secondes);
    const embed = embedBuilder({
      title: '🛡️ Slowmode',
      description: `Slowmode défini sur ${secondes} secondes.`,
      color: 0xFEE75C,
      footer: { text: 'Commande de modération' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
