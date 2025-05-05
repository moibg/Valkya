const { SlashCommandBuilder } = require('discord.js');
const Warning = require('../../models/Warning');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Affiche les avertissements d\'un membre')
    .addUserOption(option => option.setName('membre').setDescription('Membre à vérifier').setRequired(true)),
  async execute(interaction) {
    const membre = interaction.options.getUser('membre');
    const warnings = await Warning.find({ guildId: interaction.guild.id, userId: membre.id });
    if (!warnings.length) {
      const embed = embedBuilder({
        title: '🛡️ Avertissements',
        description: `${membre} n'a aucun avertissement.`,
        color: 0x57F287,
        footer: { text: 'Commande de modération' }
      });
      await interaction.reply({ embeds: [embed] });
    } else {
      const desc = warnings.map((w, i) => `#${i+1} • ${w.reason} *(par <@${w.moderatorId}> le ${w.date.toLocaleDateString()})*`).join('\n');
      await interaction.reply({ embeds: [embedBuilder({
        title: `🛡️ Avertissements de ${membre.tag}`,
        description: desc,
        color: 0xFEE75C,
        footer: { text: 'Commande de modération' }
      })] });
    }
  }
};
