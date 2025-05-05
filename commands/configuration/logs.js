const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Config = require('../../models/Config');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Configurer le salon de logs')
    .addChannelOption(option => option.setName('salon').setDescription('Salon de logs').setRequired(true)),
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
      { $set: { logsChannel: salon.id } },
      { upsert: true }
    );
    await interaction.reply({ embeds: [embedBuilder({
      title: '⚙️ Configuration logs',
      description: `Salon de logs configuré sur ${salon}`,
      color: 0x57F287,
      footer: { text: 'Commande de configuration' }
    })] });
  }
};
