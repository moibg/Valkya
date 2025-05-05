const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Supprime tous les messages du salon'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Permission refusée',
        description: 'Vous devez avoir la permission de gérer les messages.',
        color: 0xED4245,
        footer: { text: 'Commande de modération' }
      })], flags: 64 });
    }
    let deleted = 0;
    let messages;
    do {
      messages = await interaction.channel.bulkDelete(100, true);
      deleted += messages.size;
    } while (messages.size === 100);
    await interaction.reply({ embeds: [embedBuilder({
      title: '🛡️ Purge',
      description: `${deleted} messages supprimés.`,
      color: 0xED4245,
      footer: { text: 'Commande de modération' }
    })], flags: 64 });
  }
};
