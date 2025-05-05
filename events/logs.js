const { Events } = require('discord.js');
const embedBuilder = require('../utils/embedBuilder');
const Config = require('../models/Config');
const fs = require('fs');

const INVITE_REGEX = /(discord\.gg|discordapp\.com\/invite|discord\.com\/invite)\/[a-zA-Z0-9]+/i;
const LINK_REGEX = /https?:\/\//i;
const BLACKLIST = ['putain', 'merde', 'fuck', 'shit']; // à compléter

async function sendLog(guild, embed) {
  const config = await Config.findOne({ guildId: guild.id });
  if (!config || !config.logsChannel) return;
  const channel = guild.channels.cache.get(config.logsChannel);
  if (channel) channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = [
  {
    name: Events.GuildMemberAdd,
    async execute(member) {
      const embed = embedBuilder({
        title: '🟢 Arrivée',
        description: `Bienvenue à <@${member.id}> (${member.user.tag}) sur le serveur !`,
        color: 0x57F287,
        footer: { text: `ID: ${member.id}` }
      });
      await sendLog(member.guild, embed);
    }
  },
  {
    name: Events.GuildMemberRemove,
    async execute(member) {
      const embed = embedBuilder({
        title: '🔴 Départ',
        description: `<@${member.id}> (${member.user.tag}) a quitté le serveur.`,
        color: 0xED4245,
        footer: { text: `ID: ${member.id}` }
      });
      await sendLog(member.guild, embed);
    }
  },
  {
    name: Events.MessageDelete,
    async execute(message) {
      if (message.partial || !message.guild || message.author?.bot) return;
      const embed = embedBuilder({
        title: '🗑️ Message supprimé',
        description: `**Auteur :** <@${message.author.id}>\n**Salon :** <#${message.channel.id}>\n**Contenu :**\n${message.content || '*Aucun texte*'}`,
        color: 0xED4245,
        footer: { text: `ID: ${message.author.id}` }
      });
      await sendLog(message.guild, embed);
    }
  },
  {
    name: Events.MessageUpdate,
    async execute(oldMsg, newMsg) {
      if (oldMsg.partial || !oldMsg.guild || oldMsg.author?.bot) return;
      if (oldMsg.content === newMsg.content) return;
      const embed = embedBuilder({
        title: '✏️ Message modifié',
        description: `**Auteur :** <@${oldMsg.author.id}>\n**Salon :** <#${oldMsg.channel.id}>\n**Avant :**\n${oldMsg.content || '*Aucun texte*'}\n**Après :**\n${newMsg.content || '*Aucun texte*'}`,
        color: 0xFEE75C,
        footer: { text: `ID: ${oldMsg.author.id}` }
      });
      await sendLog(oldMsg.guild, embed);
    }
  },
  {
    name: Events.GuildBanAdd,
    async execute(ban) {
      const embed = embedBuilder({
        title: '⛔ Ban',
        description: `<@${ban.user.id}> (${ban.user.tag}) a été banni du serveur.`,
        color: 0xED4245,
        footer: { text: `ID: ${ban.user.id}` }
      });
      await sendLog(ban.guild, embed);
    }
  },
  {
    name: Events.GuildBanRemove,
    async execute(ban) {
      const embed = embedBuilder({
        title: '✅ Unban',
        description: `<@${ban.user.id}> (${ban.user.tag}) a été débanni du serveur.`,
        color: 0x57F287,
        footer: { text: `ID: ${ban.user.id}` }
      });
      await sendLog(ban.guild, embed);
    }
  },
  {
    name: Events.GuildChannelCreate,
    async execute(channel) {
      if (!channel.guild) return;
      const embed = embedBuilder({
        title: '📁 Salon créé',
        description: `Salon créé : <#${channel.id}> (${channel.name})` ,
        color: 0x57F287,
        footer: { text: `ID: ${channel.id}` }
      });
      await sendLog(channel.guild, embed);
    }
  },
  {
    name: Events.GuildChannelDelete,
    async execute(channel) {
      if (!channel.guild) return;
      const embed = embedBuilder({
        title: '🗑️ Salon supprimé',
        description: `Salon supprimé : ${channel.name}` ,
        color: 0xED4245,
        footer: { text: `ID: ${channel.id}` }
      });
      await sendLog(channel.guild, embed);
    }
  },
  {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
      if (oldMember.nickname !== newMember.nickname) {
        const embed = embedBuilder({
          title: '✏️ Changement de pseudo',
          description: `<@${newMember.id}> a changé de pseudo :\n**Avant :** ${oldMember.nickname || oldMember.user.username}\n**Après :** ${newMember.nickname || newMember.user.username}`,
          color: 0x5865F2,
          footer: { text: `ID: ${newMember.id}` }
        });
        await sendLog(newMember.guild, embed);
      }
      // Ajout/retrait de rôle
      const oldRoles = new Set(oldMember.roles.cache.keys());
      const newRoles = new Set(newMember.roles.cache.keys());
      const added = [...newRoles].filter(x => !oldRoles.has(x));
      const removed = [...oldRoles].filter(x => !newRoles.has(x));
      if (added.length > 0) {
        for (const roleId of added) {
          const role = newMember.guild.roles.cache.get(roleId);
          if (role) {
            const embed = embedBuilder({
              title: '➕ Rôle ajouté',
              description: `<@${newMember.id}> a reçu le rôle ${role}`,
              color: 0x57F287,
              footer: { text: `ID: ${newMember.id}` }
            });
            await sendLog(newMember.guild, embed);
          }
        }
      }
      if (removed.length > 0) {
        for (const roleId of removed) {
          const role = newMember.guild.roles.cache.get(roleId);
          if (role) {
            const embed = embedBuilder({
              title: '➖ Rôle retiré',
              description: `<@${newMember.id}> a perdu le rôle ${role}`,
              color: 0xED4245,
              footer: { text: `ID: ${newMember.id}` }
            });
            await sendLog(newMember.guild, embed);
          }
        }
      }
    }
  },
  {
    name: Events.GuildMemberBanAdd,
    async execute(guild, user) {
      const embed = embedBuilder({
        title: '⛔ Ban (API)',
        description: `<@${user.id}> (${user.tag}) a été banni du serveur (API event).`,
        color: 0xED4245,
        footer: { text: `ID: ${user.id}` }
      });
      await sendLog(guild, embed);
    }
  },
  {
    name: Events.GuildMemberBanRemove,
    async execute(guild, user) {
      const embed = embedBuilder({
        title: '✅ Unban (API)',
        description: `<@${user.id}> (${user.tag}) a été débanni du serveur (API event).`,
        color: 0x57F287,
        footer: { text: `ID: ${user.id}` }
      });
      await sendLog(guild, embed);
    }
  },
  {
    name: Events.GuildRoleCreate,
    async execute(role) {
      const embed = embedBuilder({
        title: '🆕 Rôle créé',
        description: `Rôle créé : ${role} (${role.name})`,
        color: 0x57F287,
        footer: { text: `ID: ${role.id}` }
      });
      await sendLog(role.guild, embed);
    }
  },
  {
    name: Events.GuildRoleDelete,
    async execute(role) {
      const embed = embedBuilder({
        title: '🗑️ Rôle supprimé',
        description: `Rôle supprimé : ${role.name}`,
        color: 0xED4245,
        footer: { text: `ID: ${role.id}` }
      });
      await sendLog(role.guild, embed);
    }
  },
  {
    name: Events.GuildRoleUpdate,
    async execute(oldRole, newRole) {
      if (oldRole.name !== newRole.name) {
        const embed = embedBuilder({
          title: '✏️ Rôle renommé',
          description: `Rôle renommé :\n**Avant :** ${oldRole.name}\n**Après :** ${newRole.name}`,
          color: 0xFEE75C,
          footer: { text: `ID: ${newRole.id}` }
        });
        await sendLog(newRole.guild, embed);
      }
    }
  },
  {
    name: Events.GuildChannelUpdate,
    async execute(oldChannel, newChannel) {
      if (oldChannel.name !== newChannel.name) {
        const embed = embedBuilder({
          title: '✏️ Salon renommé',
          description: `Salon renommé :\n**Avant :** ${oldChannel.name}\n**Après :** ${newChannel.name}`,
          color: 0xFEE75C,
          footer: { text: `ID: ${newChannel.id}` }
        });
        await sendLog(newChannel.guild, embed);
      }
    }
  },
  {
    name: Events.MessageCreate,
    async execute(message) {
      if (message.author.bot || !message.guild) return;
      const config = await Config.findOne({ guildId: message.guild.id });
      // Anti-spam simple (5 messages/5s)
      if (!global.spamMap) global.spamMap = new Map();
      const now = Date.now();
      const arr = global.spamMap.get(message.author.id) || [];
      arr.push(now);
      global.spamMap.set(message.author.id, arr.filter(t => now - t < 5000));
      if (arr.length > 5) {
        await message.delete().catch(() => {});
        return message.channel.send({ content: `<@${message.author.id}> stop spam!` });
      }
      // Anti-invites
      if (INVITE_REGEX.test(message.content)) {
        await message.delete().catch(() => {});
        return message.channel.send({ content: `❌ Pas d'invitations Discord ici, <@${message.author.id}>.` });
      }
      // Anti-liens
      if (LINK_REGEX.test(message.content) && !message.member.permissions.has('ManageMessages')) {
        await message.delete().catch(() => {});
        return message.channel.send({ content: `❌ Pas de liens ici, <@${message.author.id}>.` });
      }
      // Blacklist mots
      if (BLACKLIST.some(w => message.content.toLowerCase().includes(w))) {
        await message.delete().catch(() => {});
        return message.channel.send({ content: `❌ Mot interdit détecté, <@${message.author.id}>.` });
      }
    }
  }
];