require('dotenv').config();

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


const prefix = '!';

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Julie is ready !');
});


client.on('message', message =>{
	console.log(message)
	if(!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if(command ==='ping'){
		message.channel.send('pong !')
	}
})


client.login(process.env.DISCORD_TOKEN)