const { Schema, model } = require('mongoose');

const ConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  welcomeChannel: String,
  modRole: String,
  ticketCategory: String,
  welcomeMessage: { type: String, default: 'Bienvenue sur le serveur !' },
  logsChannel: String,
  ticketLogsChannel: { type: String },
  features: {
    xp: { type: Boolean, default: true },
    economy: { type: Boolean, default: true },
    moderation: { type: Boolean, default: true },
    tickets: { type: Boolean, default: true },
    fun: { type: Boolean, default: true },
    suggestions: { type: Boolean, default: true },
    polls: { type: Boolean, default: true }
  },
  levelRoles: { type: [{ level: Number, roleId: String }], default: [] },
  autoRole: { type: String }
});

module.exports = model('Config', ConfigSchema);
