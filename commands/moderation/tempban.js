const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tempban')
    .setDescription('Ban temporairement un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à bannir').setRequired(true))
    .addIntegerOption(option => option.setName('jours').setDescription('Nombre de jours').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison du ban').setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Permission refusée',
        description: 'Vous devez avoir la permission de bannir.',
        color: 0xED4245,
        footer: { text: 'Commande de modération' }
      })], flags: 64 });
    }
    const user = interaction.options.getUser('membre');
    const jours = interaction.options.getInteger('jours');
    const raison = interaction.options.getString('raison') || 'Aucune raison spécifiée';
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
    setTimeout(async () => {
      await interaction.guild.members.unban(user.id).catch(() => {});
    }, jours * 24 * 60 * 60 * 1000);
    const embed = embedBuilder({
      title: '🛡️ Ban temporaire',
      description: `${user.tag} banni pour ${jours} jour(s).\n**Raison :** ${raison}`,
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
