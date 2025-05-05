const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Rend muet un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à rendre muet').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison du mute').setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Permission refusée',
        description: 'Vous devez avoir la permission de rendre muet.',
        color: 0xED4245,
        footer: { text: 'Commande de modération' }
      })], flags: 64 });
    }
    const membre = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison spécifiée';
    if (!membre) return interaction.reply({ embeds: [embedBuilder({
      title: '🛡️ Erreur',
      description: 'Membre introuvable.',
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    })], flags: 64 });
    await membre.timeout(60 * 60 * 1000, raison); // 1h par défaut
    const embed = embedBuilder({
      title: '🛡️ Membre mute',
      description: `${membre} a été rendu muet.\n**Raison :** ${raison}`,
      color: 0xFEE75C,
      footer: { text: 'Commande de modération' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
