const { Schema, model } = require('mongoose');
const XPSchema = new Schema({
  guildId: String,
  userId: String,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});
module.exports = model('XP', XPSchema);
