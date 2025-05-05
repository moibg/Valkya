const { SlashCommandBuilder } = require('discord.js');
const XP = require('../../models/XP');
const embedBuilder = require('../../utils/embedBuilder');
const { getLang } = require('../../utils/lang');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlevelrole')
    .setDescription('Assigne un rôle automatique à un niveau donné')
    .addIntegerOption(opt => opt.setName('niveau').setDescription('Niveau requis').setRequired(true))
    .addRoleOption(opt => opt.setName('role').setDescription('Rôle à donner').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'Permission refusée.', ephemeral: true });
    }
    const level = interaction.options.getInteger('niveau');
    const role = interaction.options.getRole('role');
    const Config = require('../../models/Config');
    let config = await Config.findOne({ guildId: interaction.guild.id });
    if (!config) config = await Config.create({ guildId: interaction.guild.id });
    if (!config.levelRoles) config.levelRoles = [];
    config.levelRoles = config.levelRoles.filter(lr => lr.level !== level);
    config.levelRoles.push({ level, roleId: role.id });
    await config.save();
    await interaction.reply({ content: `Le rôle ${role} sera donné au niveau ${level}.`, ephemeral: true });
  }
};