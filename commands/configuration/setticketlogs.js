const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Config = require('../../models/Config');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setticketlogs')
    .setDescription('Définit le salon où seront envoyés les logs de tickets')
    .addChannelOption(opt => opt.setName('salon').setDescription('Salon de logs').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '⚙️ Permission refusée',
        description: 'Vous devez être administrateur.',
        color: 0xED4245,
        footer: { text: 'Commande de configuration' }
      })], flags: 64 });
    }
    const salon = interaction.options.getChannel('salon');
    await Config.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { ticketLogsChannel: salon.id } },
      { upsert: true }
    );
    await interaction.reply({ embeds: [embedBuilder({
      title: '⚙️ Configuration logs de tickets',
      description: `Salon de logs de tickets configuré sur ${salon}`,
      color: 0x57F287,
      footer: { text: 'Commande de configuration' }
    })] });
  }
};
