const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Config = require('../../models/Config');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('closeticket')
    .setDescription('Ferme le ticket et envoie le transcript')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const config = await Config.findOne({ guildId: interaction.guild.id });
    const logsChannelId = config?.ticketLogsChannel;
    const channel = interaction.channel;
    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: 'Cette commande doit être utilisée dans un ticket.', ephemeral: true });
    }
    // Génération transcript texte
    const messages = await channel.messages.fetch({ limit: 100 });
    const transcript = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp)
      .map(m => `[${new Date(m.createdTimestamp).toLocaleString()}] ${m.author.tag}: ${m.content}`)
      .join('\n');
    // Envoi transcript dans logs
    if (logsChannelId) {
      const logsChannel = interaction.guild.channels.cache.get(logsChannelId);
      if (logsChannel) {
        await logsChannel.send({
          files: [{ attachment: Buffer.from(transcript, 'utf-8'), name: `${channel.name}-transcript.txt` }],
          embeds: [embedBuilder({
            title: '📄 Transcript de ticket',
            description: `Ticket fermé par <@${interaction.user.id}> dans ${channel}`,
            color: 0xED4245
          })]
        });
      }
    }
    await interaction.reply({ content: 'Ticket fermé et transcript envoyé dans les logs.', ephemeral: true });
    setTimeout(() => channel.delete().catch(() => {}), 3000);
  }
};