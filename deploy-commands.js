const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const dotenv = require('dotenv');

dotenv.config();

const commands = [];
// Grab all the commands from the commad directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Deploy commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
        // The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
            // Used to update certain guild's commands
			// Routes.applicationGuildCommands(clientId, guildId),

            Routes.applicationCommands(process.env.clientId),
			{ body: commands },
		);

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // Catch errors
        console.error(error);
    }
})();

//rest.delete(Routes.applicationCommand(process.env.clientId, 1077719201747324938))
//.then(() => console.log('Successfully deleted application command'))
//.catch(console.error);