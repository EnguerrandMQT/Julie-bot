import 'dotenv/config'

import {
	Client,
	Intents
} from 'discord.js';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

import Commands from './commands/meteo.js'

const prefix = '!';

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Julie is online !');
});


client.on('messageCreate', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	console.log(message.content)
	const args = message.content.slice(prefix.length).split(/ +/);
	const com = args.shift().toLowerCase();

	if (com === 'ping') {
		message.channel.send('pong !')

	} else if (com === 'meteo') {
		let msg = "Error with weather";
		if (args.length >= 1) {
			let arg = ""
			args.forEach(e => {
				arg+=e+" "
			});
			msg = await Commands.getMeteo(true, arg)
		} else {
			msg = await Commands.getMeteo(false)

		}
		console.log(msg)
		message.channel.send(msg)

	} else if (com === 'clear') {
		if (!args[0]) return message.reply('Entre le nombre de messages à supprimer')
		if (isNaN(args[0])) return message.reply('Entre un nombre !');

		if (args[0] < 1) return message.reply('Il faut au moins un message')

		await (message.channel.messages.fetch({
			limit: args[0]
		})).then(messages => {
			message.channel.bulkDelete(messages);
		})
		message.channel.send('*' + args[0] + ' messages supprimés ;) *')
	}
})


client.login(process.env.DISCORD_TOKEN)