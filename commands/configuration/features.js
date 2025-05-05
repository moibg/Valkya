const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Config = require('../../models/Config');
const embedBuilder = require('../../utils/embedBuilder');

const FEATURES = [
  { key: 'xp', label: 'XP & Niveaux', emoji: '🏅' },
  { key: 'economy', label: 'Économie', emoji: '💰' },
  { key: 'moderation', label: 'Modération', emoji: '🛡️' },
  { key: 'tickets', label: 'Tickets', emoji: '🎫' },
  { key: 'fun', label: 'Fun & Mini-jeux', emoji: '🎲' },
  { key: 'suggestions', label: 'Suggestions', emoji: '💡' },
  { key: 'polls', label: 'Sondages', emoji: '📊' },
  // Tu peux en ajouter autant que tu veux ici
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('features')
    .setDescription('Active ou désactive les fonctionnalités du bot'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        embeds: [embedBuilder({
          title: '⚙️ Permission refusée',
          description: 'Vous devez être administrateur.',
          color: 0xED4245
        })],
        ephemeral: true
      });
    }

    let config = await Config.findOne({ guildId: interaction.guild.id });
    if (!config) config = await Config.create({ guildId: interaction.guild.id });

    const embed = embedBuilder({
      title: '🔧 Gestion des fonctionnalités',
      description: FEATURES.map(f =>
        `${f.emoji} **${f.label}** : ${config.features?.[f.key] ? '✅ Activée' : '❌ Désactivée'}`
      ).join('\n'),
      color: 0x5865F2,
      footer: { text: 'Clique sur un bouton pour activer/désactiver.' }
    });

    if (FEATURES.length > 25) {
      return interaction.reply({
        embeds: [embedBuilder({
          title: '❗ Trop de fonctionnalités',
          description: 'Discord limite à 25 boutons maximum dans un message. Réduis le nombre de fonctionnalités ou adapte l’interface.',
          color: 0xED4245
        })],
        ephemeral: true
      });
    }

    const rows = [];
    for (let i = 0; i < FEATURES.length; i += 5) {
      const buttons = FEATURES.slice(i, i + 5).map(f =>
        new ButtonBuilder()
          .setCustomId(`feature_${f.key}`)
          .setLabel(f.label)
          .setEmoji(f.emoji)
          .setStyle(config.features?.[f.key] ? ButtonStyle.Success : ButtonStyle.Secondary)
      );
      rows.push(new ActionRowBuilder().addComponents(buttons));
    }

    await interaction.reply({
      embeds: [embed],
      components: rows,
      ephemeral: true
    });
  }
};
