const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
let { global } = require('../global.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('geterroredlogs')
        .setDescription('Generates a list of the errored logs'),
    async execute(interaction) {
        if (global.erroredLogs.length > 0) {
            await interaction.reply({ content: `${global.erroredLogs}` , ephemeral: true });
        } else {
            await interaction.reply({ content: 'No logs errored.' , ephemeral: true });
        } 
        
    },
};