const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Config = require('../../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setautorole')
    .setDescription('Définit le rôle automatique pour les nouveaux membres')
    .addRoleOption(opt => opt.setName('role').setDescription('Rôle à donner').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const role = interaction.options.getRole('role');
    let config = await Config.findOne({ guildId: interaction.guild.id });
    if (!config) config = await Config.create({ guildId: interaction.guild.id });
    config.autoRole = role.id;
    await config.save();
    await interaction.reply({ content: `Le rôle automatique est maintenant ${role}.`, ephemeral: true });
  }
};