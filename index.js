// Require the necessary discord.js classes
const { joinVoiceChannel } = require('@discordjs/voice');
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
	partials: ['CHANNEL'],
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('x-card-bot is ready!');
});

// Handle receiving a direct message
client.on('messageCreate', message => {
	const memberCallback = member => {
		if (member.voice.channelId != null) {
			const connection = joinVoiceChannel({
				channelId: member.voice.channelId,
				guildId: member.voice.guild.id,
				adapterCreator: member.voice.guild.voiceAdapterCreator,
			});
			setTimeout(() => connection.destroy(), 1000);
		}
		else {
			console.log('No voice channel detected');
		}
	};
	const guildCallback = guild => guild.members.fetch(message.author.id).then(memberCallback);
	const guildsCallback = guilds => guilds.forEach(guild => client.guilds.fetch(guild.id).then(guildCallback));
	client.guilds.fetch().then(guildsCallback);
});

// Login to Discord with your client's token
client.login(token);
