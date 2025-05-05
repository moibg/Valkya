const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ChannelType } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const Config = require('../../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ouvre un ticket d\'assistance'),
  async execute(interaction) {
    const config = await Config.findOne({ guildId: interaction.guild.id });
    const categoryId = config?.ticketCategory;
    const existing = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
    if (existing) {
      return interaction.reply({ content: 'Tu as déjà un ticket ouvert.', ephemeral: true });
    }
    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.id}`,
      type: ChannelType.GuildText,
      parent: categoryId || null,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: ['ViewChannel'] },
        { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'AttachFiles'] },
        { id: interaction.client.user.id, allow: ['ViewChannel', 'SendMessages', 'AttachFiles'] }
      ]
    });
    await channel.send({ embeds: [embedBuilder({
      title: '🎫 Ticket ouvert',
      description: `<@${interaction.user.id}> a ouvert un ticket. Un membre du staff va te répondre.\nUtilise /closeticket pour fermer ce ticket.`,
      color: 0x5865F2
    })] });
    await interaction.reply({ content: `Ticket ouvert : ${channel}`, ephemeral: true });
  }
};
