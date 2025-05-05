const XP = require('../models/XP');
const Config = require('../models/Config');
module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;
    const xpToAdd = Math.floor(Math.random() * 10) + 5;
    let userXP = await XP.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!userXP) userXP = await XP.create({ guildId: message.guild.id, userId: message.author.id });
    userXP.xp += xpToAdd;
    const nextLevel = Math.floor(0.2 * Math.sqrt(userXP.xp));
    if (nextLevel > userXP.level) {
      userXP.level = nextLevel;
      // Attribution automatique de rôle si configuré
      const config = await Config.findOne({ guildId: message.guild.id });
      if (config && config.levelRoles) {
        const reward = config.levelRoles.find(lr => lr.level === userXP.level);
        if (reward) {
          const member = await message.guild.members.fetch(message.author.id);
          if (member && !member.roles.cache.has(reward.roleId)) {
            await member.roles.add(reward.roleId).catch(() => {});
            message.channel.send({ content: `🎉 <@${message.author.id}> a reçu le rôle <@&${reward.roleId}> pour avoir atteint le niveau **${userXP.level}** !` });
          }
        }
      }
      message.channel.send({ content: `🎉 <@${message.author.id}> passe niveau **${userXP.level}** !` });
    }
    await userXP.save();
  }
};
