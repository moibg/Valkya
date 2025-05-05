const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Config = require('../../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Configure le message et le salon de bienvenue')
    .addChannelOption(opt => opt.setName('salon').setDescription('Salon de bienvenue').setRequired(true))
    .addStringOption(opt => opt.setName('message').setDescription('Message de bienvenue (utilise {user} pour mentionner)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('salon');
    const message = interaction.options.getString('message');
    let config = await Config.findOne({ guildId: interaction.guild.id });
    if (!config) config = await Config.create({ guildId: interaction.guild.id });
    config.welcomeChannel = channel.id;
    if (message) config.welcomeMessage = message;
    await config.save();
    await interaction.reply({ content: `Salon de bienvenue configuré sur ${channel} et message mis à jour.`, ephemeral: true });
  }
};