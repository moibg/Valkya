const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Config = require('../../models/Config');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configurer le salon et le message de bienvenue')
    .addChannelOption(option => option.setName('salon').setDescription('Salon de bienvenue').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('Message de bienvenue personnalisé').setRequired(false)),
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
    const message = interaction.options.getString('message') || 'Bienvenue sur le serveur !';
    await Config.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { welcomeChannel: salon.id, welcomeMessage: message } },
      { upsert: true }
    );
    await interaction.reply({ embeds: [embedBuilder({
      title: '⚙️ Configuration bienvenue',
      description: `Salon de bienvenue configuré sur ${salon} avec le message :\n> ${message}`,
      color: 0x57F287,
      footer: { text: 'Commande de configuration' }
    })] });
  }
};
