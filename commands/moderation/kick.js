const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulse un membre du serveur')
    .addUserOption(option => option.setName('membre').setDescription('Membre à expulser').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison de l\'expulsion').setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Permission refusée',
        description: 'Vous n\'avez pas la permission d\'expulser.',
        color: 0xED4245,
        footer: { text: 'Commande de modération' }
      })], flags: 64 });
    }
    const user = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ embeds: [embedBuilder({
      title: '🛡️ Erreur',
      description: 'Membre introuvable.',
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    })], flags: 64 });
    if (!member.kickable) return interaction.reply({ embeds: [embedBuilder({
      title: '🛡️ Erreur',
      description: 'Impossible d\'expulser ce membre.',
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    })], flags: 64 });
    const embed = embedBuilder({
      title: '🛡️ Expulsion',
      description: `${user.tag} a été expulsé.\n**Raison :** ${reason}`,
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
