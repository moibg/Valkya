const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const path = require('path');

const CATEGORIES = {
  moderation: {
    label: 'Modération',
    emoji: '🛡️',
    folder: 'moderation',
    color: 0xED4245
  },
  configuration: {
    label: 'Configuration',
    emoji: '⚙️',
    folder: 'configuration',
    color: 0x5865F2
  },
  ticket: {
    label: 'Tickets',
    emoji: '🎫',
    folder: 'ticket',
    color: 0x57F287
  },
  utilities: {
    label: 'Utilitaires',
    emoji: '🔧',
    folder: 'utilities',
    color: 0xFEE75C
  },
  fun: {
    label: 'Fun & Mini-jeux',
    emoji: '🎲',
    folder: 'utilities', // fun regroupe dans utilities
    color: 0xFEE75C
  },
  economy: {
    label: 'Économie',
    emoji: '💰',
    folder: 'utilities', // economy regroupe dans utilities
    color: 0xFEE75C
  },
  xp: {
    label: 'XP & Niveaux',
    emoji: '🏅',
    folder: 'utilities', // xp regroupe dans utilities
    color: 0xFEE75C
  }
};

function getCommandsByCategory(client, category) {
  if (!category) return [];
  // Catégorisation avancée par nom de commande
  const funCmds = ['8ball', 'game'];
  const economyCmds = ['balance', 'pay', 'daily'];
  const xpCmds = ['rank', 'leaderboard'];
  return Array.from(client.commands.values()).filter(cmd => {
    if (category.label === 'Fun & Mini-jeux') return funCmds.includes(cmd.data.name);
    if (category.label === 'Économie') return economyCmds.includes(cmd.data.name);
    if (category.label === 'XP & Niveaux') return xpCmds.includes(cmd.data.name);
    return cmd.category === category.folder && !funCmds.includes(cmd.data.name) && !economyCmds.includes(cmd.data.name) && !xpCmds.includes(cmd.data.name);
  });
}

function formatCommand(cmd) {
  return `\`/${cmd.data.name}\`  →  *${cmd.data.description}*`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche la liste des commandes par catégorie'),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    // Ajout du chemin de fichier à chaque commande (pour le filtrage)
    client.commands.forEach((cmd, name) => {
      if (!cmd.data.__filePath && cmd.data.name) {
        try {
          const mod = require.resolve(`../${cmd.data.name}.js`, { paths: [__dirname, '../moderation', '../utilities', '../configuration', '../ticket'] });
          cmd.data.__filePath = mod;
        } catch {}
      }
    });
    const options = Object.entries(CATEGORIES).map(([key, cat]) =>
      new StringSelectMenuOptionBuilder()
        .setLabel(cat.label)
        .setValue(key)
        .setEmoji(cat.emoji)
    );
    const select = new StringSelectMenuBuilder()
      .setCustomId('help_category')
      .setPlaceholder('Choisis une catégorie')
      .addOptions(options);
    const row = new ActionRowBuilder().addComponents(select);
    // Par défaut, affiche la première catégorie
    const firstKey = Object.keys(CATEGORIES)[0];
    const cmds = getCommandsByCategory(client, CATEGORIES[firstKey]);
    const embed = embedBuilder({
      title: `${CATEGORIES[firstKey].emoji} Commandes ${CATEGORIES[firstKey].label}`,
      description: cmds.length ? cmds.map(formatCommand).join('\n') : 'Aucune commande.',
      color: CATEGORIES[firstKey].color,
      footer: { text: `Sélectionne une catégorie pour voir les commandes.` }
    });
    const reply = await interaction.editReply({ embeds: [embed], components: [row] });
    // Gestion de l'interaction du select
    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 60000,
      filter: i => i.user.id === interaction.user.id
    });
    collector.on('collect', async i => {
      const catKey = i.values[0];
      const cat = CATEGORIES[catKey];
      const cmds = getCommandsByCategory(client, cat);
      const embed = embedBuilder({
        title: `${cat.emoji} Commandes ${cat.label}`,
        description: cmds.length ? cmds.map(formatCommand).join('\n') : 'Aucune commande.',
        color: cat.color,
        footer: { text: `Sélectionne une catégorie pour voir les commandes.` }
      });
      await i.update({ embeds: [embed], components: [row] });
    });
    collector.on('end', async () => {
      if (reply) {
        try {
          await interaction.editReply({ components: [] });
        } catch {}
      }
    });
  }
};
