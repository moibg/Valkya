const { Events, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');
const embedBuilder = require('../utils/embedBuilder');

const TICKET_TYPES = {
  probleme: {
    label: 'Problème',
    emoji: '❗',
    color: 0xED4245,
    desc: 'Merci de décrire précisément votre problème. Un membre du staff va vous aider.'
  },
  partenariat: {
    label: 'Partenariat',
    emoji: '🤝',
    color: 0xFEE75C,
    desc: 'Merci de détailler votre demande de partenariat. Un responsable vous répondra.'
  },
  question: {
    label: 'Question',
    emoji: '❓',
    color: 0x5865F2,
    desc: 'Posez votre question, un membre du staff vous répondra rapidement.'
  },
  recrutement: {
    label: 'Recrutement Staff',
    emoji: '🧑‍💼',
    color: 0x57F287,
    desc: 'Expliquez pourquoi vous souhaitez rejoindre le staff. Nous étudierons votre candidature.'
  }
};

const FEATURES = [
  { key: 'xp', label: 'XP & Niveaux' },
  { key: 'economy', label: 'Économie' },
  { key: 'moderation', label: 'Modération' },
  { key: 'tickets', label: 'Tickets' },
  { key: 'fun', label: 'Fun & Mini-jeux' },
  { key: 'suggestions', label: 'Suggestions' },
  { key: 'polls', label: 'Sondages' }
];

async function isFeatureEnabled(guild, feature) {
  const Config = require('../models/Config');
  const config = await Config.findOne({ guildId: guild.id });
  if (!config || !config.features) return true;
  return config.features[feature] !== false;
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    // Vérification de la fonctionnalité pour chaque commande
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      // Détection automatique de la feature liée à la commande
      let feature = null;
      if (['rank', 'leaderboard'].includes(command.data.name)) feature = 'xp';
      if (['balance', 'pay', 'daily'].includes(command.data.name)) feature = 'economy';
      if (['ban', 'kick', 'mute', 'clear', 'warn', 'warnings', 'lock', 'unlock', 'slowmode', 'giverole', 'removerole', 'tempban', 'antiraid'].includes(command.data.name)) feature = 'moderation';
      if (['ticket', 'ticketpanel'].includes(command.data.name)) feature = 'tickets';
      if (['8ball', 'game', 'ping', 'reminder', 'stats', 'botinfo', 'userinfo', 'serverinfo'].includes(command.data.name)) feature = 'fun';
      if (['suggest'].includes(command.data.name)) feature = 'suggestions';
      if (['poll'].includes(command.data.name)) feature = 'polls';
      if (feature && !(await isFeatureEnabled(interaction.guild, feature))) {
        return interaction.reply({ content: `❌ Cette fonctionnalité est désactivée sur ce serveur.`, ephemeral: true });
      }
    }
    // Menu de sélection du type de ticket
    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_type') {
      const type = interaction.values[0];
      const ticketInfo = TICKET_TYPES[type];
      if (!ticketInfo) return;
      const Config = require('../models/Config');
      const config = await Config.findOne({ guildId: interaction.guild.id });
      const categoryId = config?.ticketCategory;
      const staffRoleId = config?.modRole;
      const existing = interaction.guild.channels.cache.find(c => c.name === `ticket-${type}-${interaction.user.id}`);
      if (existing) {
        return interaction.reply({ content: 'Tu as déjà un ticket ouvert pour ce type.', ephemeral: true });
      }
      const channel = await interaction.guild.channels.create({
        name: `ticket-${type}-${interaction.user.id}`,
        type: ChannelType.GuildText,
        parent: categoryId || null,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: ['ViewChannel'] },
          { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'AttachFiles'] },
          staffRoleId ? { id: staffRoleId, allow: ['ViewChannel', 'SendMessages', 'AttachFiles'] } : null,
          { id: interaction.client.user.id, allow: ['ViewChannel', 'SendMessages', 'AttachFiles'] }
        ].filter(Boolean)
      });
      await channel.send({
        content: staffRoleId ? `<@&${staffRoleId}>` : undefined,
        embeds: [embedBuilder({
          title: `${ticketInfo.emoji} Ticket ${ticketInfo.label}`,
          description: `${ticketInfo.desc}\n\n> **Utilisateur :** <@${interaction.user.id}>` ,
          color: ticketInfo.color,
          footer: { text: 'Support Valkya' }
        })],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('close_ticket')
              .setLabel('Fermer le ticket')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('🔒')
          )
        ]
      });
      await interaction.reply({ content: `Votre ticket a été créé : ${channel}`, ephemeral: true });
    }
    // Fermeture du ticket
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
      await interaction.reply({ embeds: [embedBuilder({
        title: '🔒 Confirmation',
        description: 'Cliquez sur le bouton ci-dessous pour confirmer la fermeture du ticket.',
        color: 0xED4245
      })], components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('confirm_close_ticket')
            .setLabel('Confirmer la fermeture')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('✅')
        )
      ], ephemeral: true });
    }
    // Confirmation de fermeture
    if (interaction.isButton() && interaction.customId === 'confirm_close_ticket') {
      const channel = interaction.channel;
      // Génération transcript texte
      const messages = await channel.messages.fetch({ limit: 100 });
      const transcript = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .map(m => `[${new Date(m.createdTimestamp).toLocaleString()}] ${m.author.tag}: ${m.content}`)
        .join('\n');
      // Envoi transcript dans logs
      const Config = require('../models/Config');
      const config = await Config.findOne({ guildId: interaction.guild.id });
      const logsChannelId = config?.ticketLogsChannel;
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
      await channel.send({ embeds: [embedBuilder({
        title: '✅ Ticket fermé',
        description: `Ce ticket va être supprimé dans 5 secondes. Merci d'avoir contacté le support !`,
        color: 0x57F287
      })] });
      setTimeout(() => channel.delete().catch(() => {}), 5000);
    }
  }
};
