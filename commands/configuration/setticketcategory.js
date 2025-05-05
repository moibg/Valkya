// Fichier: setticketcategory.js
const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Config = require('../../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setticketcategory')
    .setDescription('Définit la catégorie où seront créés les tickets')
    .addChannelOption(opt => opt.setName('categorie').setDescription('Catégorie de tickets').addChannelTypes(ChannelType.GuildCategory).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const category = interaction.options.getChannel('categorie');
    let config = await Config.findOne({ guildId: interaction.guild.id });
    if (!config) config = await Config.create({ guildId: interaction.guild.id });
    config.ticketCategory = category.id;
    await config.save();
    await interaction.reply({ content: `Catégorie de tickets configurée sur ${category}.`, ephemeral: true });
  }
};