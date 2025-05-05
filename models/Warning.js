const { Schema, model } = require('mongoose');

const WarningSchema = new Schema({
  guildId: String,
  userId: String,
  moderatorId: String,
  reason: String,
  date: { type: Date, default: Date.now }
});

module.exports = model('Warning', WarningSchema);
