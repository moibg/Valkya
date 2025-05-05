require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events, InteractionType, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const embedBuilder = require('./utils/embedBuilder');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ]
});

client.commands = new Collection();

// Chargement des commandes
function loadCommands(dir, parentCategory = null) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.lstatSync(path.join(dir, file));
    if (stat.isDirectory()) {
      loadCommands(path.join(dir, file), file); // file = nom du dossier (catégorie)
    } else if (file.endsWith('.js')) {
      const command = require(path.join(dir, file));
      if (command.data && command.execute) {
        command.category = parentCategory;
        client.commands.set(command.data.name, command);
      }
    }
  }
}
loadCommands(path.join(__dirname, 'commands'));

// Chargement des événements
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.type !== InteractionType.ApplicationCommand) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embedBuilder({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'exécution de la commande.',
        color: 0xED4245
      })], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [embedBuilder({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'exécution de la commande.',
        color: 0xED4245
      })], ephemeral: true });
    }
  }
});

async function registerCommands() {
  const commands = [];
  function collectCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const stat = fs.lstatSync(path.join(dir, file));
      if (stat.isDirectory()) {
        collectCommands(path.join(dir, file));
      } else if (file.endsWith('.js')) {
        const command = require(path.join(dir, file));
        if (command.data) {
          commands.push(command.data.toJSON());
        }
      }
    }
  }
  collectCommands(path.join(__dirname, 'commands'));

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try {
    console.log('🔄 Synchronisation des commandes slash (globales et guildes)...');
    // Synchronisation globale (supprime les anciennes globales)
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    // Synchronisation sur chaque guilde (supprime les anciennes commandes de guilde)
    const guilds = await client.guilds.fetch();
    for (const [guildId] of guilds) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
        { body: commands }
      );
    }
    console.log('✅ Commandes synchronisées et anciennes supprimées !');
  } catch (error) {
    console.error('Erreur lors de la synchro des commandes :', error);
  }
}

// Suppression du handler ready ici, tout sera géré dans events/ready.js

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connecté à MongoDB');
}).catch(console.error);

// Login Discord
client.login(process.env.TOKEN);
