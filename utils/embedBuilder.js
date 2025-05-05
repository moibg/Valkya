const { EmbedBuilder } = require('discord.js');

function embedBuilder({ title, description, color, footer, thumbnail, image, author, fields }) {
  const embed = {
    title,
    description,
    color,
    timestamp: new Date(),
    footer: footer ? { text: footer.text, icon_url: footer.icon_url || undefined } : undefined,
    thumbnail: thumbnail ? { url: thumbnail } : undefined,
    image: image ? { url: image } : undefined,
    author: author ? { name: author.name, icon_url: author.icon_url } : undefined,
    fields: fields || undefined
  };
  // Nettoyage des champs vides
  Object.keys(embed).forEach(k => (embed[k] === undefined) && delete embed[k]);
  return embed;
}

module.exports = embedBuilder;
