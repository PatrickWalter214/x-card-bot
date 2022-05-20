// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.DIRECT_MESSAGES], partials: ['CHANNEL'] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Handle receiving a direct message
client.on('messageCreate', message => {
	console.log(message.author.id);
});

// Login to Discord with your client's token
client.login(token);
