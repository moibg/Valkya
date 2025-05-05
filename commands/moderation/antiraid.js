const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antiraid')
    .setDescription('Active ou désactive le mode anti-raid')
    .addBooleanOption(option => option.setName('etat').setDescription('Activer ?').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ embeds: [embedBuilder({ title: 'Permission refusée', description: 'Vous devez être administrateur.', color: 0xED4245 })], flags: 64 });
    }
    const etat = interaction.options.getBoolean('etat');
    const embed = embedBuilder({
      title: '📝 Antiraid',
      description: `Mode anti-raid ${etat ? 'activé' : 'désactivé'} !`,
      color: etat ? 0x57F287 : 0xED4245,
      footer: { text: 'Commande de modération' }
    });
    await interaction.reply({ embeds: [embed] });
  }
};
