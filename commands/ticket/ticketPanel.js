const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const TICKET_TYPES = [
  { value: 'probleme', label: 'Problème', emoji: '❗', description: 'Signaler un problème ou bug.' },
  { value: 'partenariat', label: 'Partenariat', emoji: '🤝', description: 'Demander un partenariat.' },
  { value: 'question', label: 'Question', emoji: '❓', description: 'Poser une question.' },
  { value: 'recrutement', label: 'Recrutement', emoji: '🧑‍💼', description: 'Candidater pour le staff.' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketpanel')
    .setDescription('Envoie un panneau de création de tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const embed = embedBuilder({
      title: '🎫 Support',
      description: 'Sélectionne le type de ticket que tu souhaites ouvrir.',
      color: 0x5865F2
    });
    const select = new StringSelectMenuBuilder()
      .setCustomId('ticket_type')
      .setPlaceholder('Choisis le type de ticket')
      .addOptions(TICKET_TYPES.map(t => ({
        label: t.label,
        value: t.value,
        emoji: t.emoji,
        description: t.description
      })));
    const row = new ActionRowBuilder().addComponents(select);
    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
  }
};
