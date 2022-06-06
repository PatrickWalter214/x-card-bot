// Require the necessary discord.js classes
const { generateDependencyReport, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { Client, Intents } = require('discord.js');
const { token, audio } = require('./config.json');
const { join } = require('node:path');

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
	partials: ['CHANNEL'],
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log(generateDependencyReport());
	console.log('x-card-bot is ready!');
});

// Handle receiving a direct message
client.on('messageCreate', message => {
	const memberCallback = member => joinAndPlayAudio(member.voice);
	const guildCallback = guild => guild.members.fetch(message.author.id).then(memberCallback);
	const guildsCallback = guilds => guilds.forEach(guild => client.guilds.fetch(guild.id).then(guildCallback));
	client.guilds.fetch().then(guildsCallback);
});

function joinAndPlayAudio(voice) {
	if (voice.channelId != null) {
		const connection = joinVoiceChannel({
			channelId: voice.channelId,
			guildId: voice.guild.id,
			adapterCreator: voice.guild.voiceAdapterCreator,
		});
		const player = createAudioPlayer();
		player.on(AudioPlayerStatus.Idle, () => {
			player.stop();
			connection.destroy();
		});
		connection.subscribe(player);
		const resource = createAudioResource(join(__dirname, 'audio', audio));
		player.play(resource);
	}
}

// Login to Discord with your client's token
client.login(token);
