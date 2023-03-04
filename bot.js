//  https://discordapp.com/oauth2/authorize?&client_id=1038218491339218965&scope=bot&permissions=76800
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');

dotenv.config();

// Initialize Discord Bot
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

bot.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Set new item in Collection with key as the command name and value as exported module
    if ('data' in command && 'execute' in command) {
        bot.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	} else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}

bot.login(process.env.TOKEN);

const express = require('express')
const app = express()
const port = 10000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})