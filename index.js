import 'dotenv/config'
import fetch from "node-fetch";

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
	console.log('Julie is ready !');
});


client.on('messageCreate', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	console.log(message.content)
	const args = message.content.slice(prefix.length).split(/ +/);
	const com = args.shift().toLowerCase();

	if (com === 'ping') {
		message.channel.send('pong !')

	} else if (com === 'meteo') {
		let msg = "Error";
		if (args.length == 1) {
			msg = await Commands.getMeteo(true, args[0])
		} else {
			msg = await Commands.getMeteo(false)
			
		}
		console.log("ici",msg)
		message.channel.send(msg)

	}
	else if(com==='clear'){
		if(!args[0]) return message.reply('Entre le nombre de messages à supprimer')
		if(isNaN(args[0])) return message.reply('ENtre un nombre');

		if(args[0]<1) return message.reply('Il faut au moins un message')

		await (message.channel.messages.fetch({limit:args[0]})).then(messages=>{
			message.channel.bulkDelete(messages);
		})
		message.channel.send('*'+args[0]+' messages supprimés*')
	}
})


client.login(process.env.DISCORD_TOKEN)