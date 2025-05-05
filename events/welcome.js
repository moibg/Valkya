const { Events } = require('discord.js');
const Config = require('../models/Config');
const embedBuilder = require('../utils/embedBuilder');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const config = await Config.findOne({ guildId: member.guild.id });
    // Welcomer image (simple, sans canvas)
    const welcomeChannelId = config?.welcomeChannel;
    const welcomeMsg = config?.welcomeMessage || `Bienvenue <@${member.id}> !`;
    if (welcomeChannelId) {
      const channel = member.guild.channels.cache.get(welcomeChannelId);
      if (channel) {
        channel.send({
          embeds: [embedBuilder({
            title: '👋 Bienvenue !',
            description: welcomeMsg.replace('{user}', `<@${member.id}>`),
            thumbnail: member.user.displayAvatarURL(),
            color: 0x57F287,
            image: 'https://media.giphy.com/media/OkJat1YNdoD3W/giphy.gif',
            footer: { text: `Membre #${member.guild.memberCount}` }
          })]
        });
      }
    }
    // Auto-role
    if (config?.autoRole) {
      const role = member.guild.roles.cache.get(config.autoRole);
      if (role) {
        member.roles.add(role).catch(() => {});
      }
    }
    // Message privé
    try {
      await member.send({
        embeds: [embedBuilder({
          title: '👋 Bienvenue sur ' + member.guild.name,
          description: welcomeMsg.replace('{user}', `<@${member.id}>`),
          color: 0x57F287
        })]
      });
    } catch {}
  }
};