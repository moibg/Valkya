const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre du serveur')
    .addUserOption(option => option.setName('membre').setDescription('Membre à bannir').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison du bannissement').setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Permission refusée',
        description: 'Vous n\'avez pas la permission de bannir.',
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
    if (!member.bannable) return interaction.reply({ embeds: [embedBuilder({
      title: '🛡️ Erreur',
      description: 'Impossible de bannir ce membre.',
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    })], flags: 64 });
    await member.ban({ reason });
    const embed = embedBuilder({
      title: '🛡️ Bannissement',
      description: `${user.tag} a été banni.\n**Raison :** ${reason}`,
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
