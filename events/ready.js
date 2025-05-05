module.exports = {
  name: 'ready',
  once: true,
  execute: async (client) => {
    console.log(`Connecté en tant que ${client.user.tag}`);
    client.user.setActivity('Modération !', { type: 0 });
    const registerCommands = require('../utils/registerCommands');
    await registerCommands(client);
  },
};
