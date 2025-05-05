const { Schema, model } = require('mongoose');
const EcoSchema = new Schema({
  guildId: String,
  userId: String,
  coins: { type: Number, default: 0 },
  inventory: { type: [String], default: [] }
});
module.exports = model('Economy', EcoSchema);
