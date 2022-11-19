//  https://discordapp.com/oauth2/authorize?&client_id=1038218491339218965&scope=bot&permissions=76800
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');

dotenv.config();

let authorizedUsers = [];
let targetSystems = [];
const newObjectiveKeywords = ['brief', 'briefing', 'New Orders', 'Orders'];

// Initialize Discord Bot
let bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

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

bot.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // console.log(interaction);
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

bot.once(Events.ClientReady, client => {
    console.log(`Connected as: ${bot.user.tag}`);
});

/*
// Helper to check if the message is updating the BGS objective
function checkForNewObjectives(messagetext) {
    for (const phrase of newObjectiveKeywords) {
        if (messagetext.includes(phrase)) {
            return true;
        }
    }
}

// Updates the objectives
function updateObjectives(messagetext) {
    var lines = messagetext.split('\n');
    for (const line of lines) {

    }
}
*/

bot.login(process.env.TOKEN);