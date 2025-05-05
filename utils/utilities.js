// Fonctions utilitaires génériques pour les commandes du bot
const embedBuilder = require('./embedBuilder');

/**
 * Répond à une interaction avec un embed
 */
async function replyEmbed(interaction, options) {
  const embed = embedBuilder(options);
  return interaction.reply({ embeds: [embed], ephemeral: options.ephemeral || false });
}

/**
 * Envoie un embed dans un salon
 */
async function sendEmbed(channel, options) {
  const embed = embedBuilder(options);
  return channel.send({ embeds: [embed] });
}

/**
 * Répond à une interaction avec un message d'erreur (texte simple)
 */
async function replyError(interaction, message, ephemeral = true) {
  return interaction.reply({ content: message, ephemeral });
}

/**
 * Ajoute des réactions à un message
 */
async function reactToMessage(message, reactions = []) {
  for (const emoji of reactions) {
    await message.react(emoji);
  }
}

module.exports = {
  replyEmbed,
  sendEmbed,
  replyError,
  reactToMessage
};
