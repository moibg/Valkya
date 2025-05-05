const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giverole')
    .setDescription('Donne un rôle à un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à qui donner le rôle').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Rôle à donner').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Permission refusée',
        description: 'Vous devez avoir la permission de gérer les rôles.',
        color: 0xED4245,
        footer: { text: 'Commande de modération' }
      })], flags: 64 });
    }
    const membre = interaction.options.getMember('membre');
    const role = interaction.options.getRole('role');
    if (!membre || !role) return interaction.reply({ embeds: [embedBuilder({
      title: '🛡️ Erreur',
      description: 'Membre ou rôle introuvable.',
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    })], flags: 64 });
    await membre.roles.add(role);
    const embed = embedBuilder({
      title: '🛡️ Rôle ajouté',
      description: `${role} ajouté à ${membre}.`,
      color: 0x57F287,
      footer: { text: 'Commande de modération' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
