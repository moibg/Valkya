const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprime un nombre de messages')
    .addIntegerOption(option => option.setName('nombre').setDescription('Nombre de messages à supprimer').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Permission refusée',
        description: 'Vous devez avoir la permission de gérer les messages.',
        color: 0xED4245,
        footer: { text: 'Commande de modération' }
      })], flags: 64 });
    }
    const nombre = interaction.options.getInteger('nombre');
    if (nombre < 1 || nombre > 100) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Erreur',
        description: 'Le nombre doit être entre 1 et 100.',
        color: 0xED4245,
        footer: { text: 'Commande de modération' }
      })], flags: 64 });
    }
    await interaction.channel.bulkDelete(nombre, true);
    const embed = embedBuilder({
      title: '🛡️ Messages supprimés',
      description: `${nombre} messages supprimés.`,
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
