const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Verrouille le salon actuel'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Permission refusée',
        description: 'Vous devez avoir la permission de gérer les salons.',
        color: 0xED4245,
        footer: { text: 'Commande de modération' }
      })], flags: 64 });
    }
    await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });
    const embed = embedBuilder({
      title: '🛡️ Salon verrouillé',
      description: 'Ce salon est maintenant verrouillé.',
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
