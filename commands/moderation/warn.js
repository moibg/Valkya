const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../../models/Warning');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertit un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à avertir').setRequired(true))
    .addStringOption(option => option.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ embeds: [embedBuilder({
        title: '🛡️ Permission refusée',
        description: 'Vous n\'avez pas la permission de modérer.',
        color: 0xED4245,
        footer: { text: 'Commande de modération' }
      })], flags: 64 });
    }
    const membre = interaction.options.getUser('membre');
    const raison = interaction.options.getString('raison');
    await Warning.create({
      guildId: interaction.guild.id,
      userId: membre.id,
      moderatorId: interaction.user.id,
      reason: raison
    });
    const embed = embedBuilder({
      title: '🛡️ Avertissement',
      description: `${membre} a été averti.\n**Raison :** ${raison}`,
      color: 0xFEE75C,
      footer: { text: 'Commande de modération' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
