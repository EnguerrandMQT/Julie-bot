import 'dotenv/config'

import {
	Client,
	Intents
} from 'discord.js';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

import Meteo from './commands/meteo.js'
import Joke from './commands/joke.js'

const prefix = '!';

// When the client is ready, run this code (only once)
client.once('ready', client => {
	console.log('Julie is online !');
});


client.on('messageCreate', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	console.log(message.content);

	const args = message.content.slice(prefix.length).split(/ +/);
	const com = args.shift().toLowerCase();

	if (com === 'ping') {
		message.channel.send('pong !');

	} else if (com === 'meteo') {
		let msg = "Error with weather";
		if (args.length >= 1) {
			let arg = "";
			args.forEach(e => {
				arg += e + " ";
			});
			console.log(arg);
			msg = await Meteo.getMeteo(arg);
		} else {
			msg = "J'ai besoin de connaître la ville !";
		}
		console.log(msg)
		message.channel.send(msg)

	} else if (com === 'clear') {
		if (!args[0]) return message.reply('Entre le nombre de messages à supprimer')
		if (isNaN(args[0])) return message.reply('Entre un nombre !');

		if (args[0] < 1) return message.reply('Il faut un entier > 0.')
		args[0]++;
		await (message.channel.messages.fetch({
			limit: args[0]
		})).then(messages => {
			message.channel.bulkDelete(messages);
		})
		message.channel.send('*' + (Number(args[0]) - 1) + ' messages supprimés :wink: *')
	} else if (com === "bonjour") {
		await message.react('👋');
		await message.react('🇼');
		await message.react('🇪');
		await message.react('🇸');
		await message.react('🇭');

	} else if (com === "roll") {
		if (!args[0]) return message.reply('Entre le nombre de dés à lancer')
		if (isNaN(args[0])) return message.reply('Entre un nombre !');

		if (args[0] < 1) return message.reply('Il faut un entier > 0.')

		let nb = Number(args[0])
		let res = 0
		let msg = "Résultat du lancer de dé : "
		for (let i = 0; i < nb; i++) {
			let nb = Math.floor(Math.random() * 6) + 1
			res += nb
			msg += nb + ' + '
		}
		msg += ` = ${res}`
		message.channel.send(msg)
	} else if (com === "random") {
		//random number between args[0] and args[1]
		if (!args[0]) return message.reply('Il faut un minimum')
		if (isNaN(Number(args[0]))) return message.reply('Entre un nombre !');

		if (!args[1]) return message.reply('Il faut un maximum')
		if (isNaN(Number(args[1]))) return message.reply('Entre un nombre !');

		let min = Number(args[0])
		let max = Number(args[1])
		let res = Math.floor(Math.random() * (max - min)) + min
		let msg = `Nombre aléatoire entre ${min} et ${max} : **${res}**`
		message.channel.send(msg)

	} else if (com === "joke") {
		let msg = await Joke.getJoke()
		message.channel.send(msg.set)
		setTimeout(() => {
			message.channel.send(msg.del)
		}, 5000);

	} else if (com === "help") {
		message.channel.send('Liste des commandes : \n' +
			'**!help** : Affiche cette liste de commandes \n' +
			'**!ping** : Julie répond pong ! \n' +
			'**!bonjour** : Julie dit bonjour \n' +
			'**!meteo** *ville* : Donne la météo à la ville donnée \n' +
			'**!roll** *nb* : Lance un ou plusieurs dés \n' +
			'**!random** *min* *max* : Donne un nombre aléatoire entre min et max \n' +
			'**!clear** *nb* : Supprime le nombre donné de messages \n' +
			'**!joke** : Julie raconte une blague \n' +
			'**!stop** : Arrête Julie')
			
	} else if (com === "stop") {
		await message.channel.send('Bye bye !')
		client.destroy()
	}

});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (interaction.commandName === 'server') {
		await interaction.reply('Server name: ' + interaction.guild.name + '\nTotal members: ' + interaction.guild.memberCount);
		//delete the message after 5 seconds
		setTimeout(() => {
			interaction.deleteReply();
		}, 5000);
	}
});


client.login(process.env.DISCORD_TOKEN)