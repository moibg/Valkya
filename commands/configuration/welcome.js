const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Config = require('../../models/Config');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Configure le message de bienvenue')
    .addStringOption(option => option.setName('message').setDescription('Message de bienvenue').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '⚙️ Permission refusée',
        description: 'Vous devez être administrateur.',
        color: 0x5865F2,
        footer: { text: 'Commande de configuration' }
      })], flags: 64 });
    }
    const message = interaction.options.getString('message');
    await Config.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { welcomeMessage: message } },
      { upsert: true }
    );
    await interaction.reply({ embeds: [embedBuilder({
      title: '👋 Bienvenue',
      description: 'Message de bienvenue configuré !',
      color: 0x57F287,
      footer: { text: 'Commande de configuration' }
    })] });
  }
};
