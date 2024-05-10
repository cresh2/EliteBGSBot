const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getFullSummary } = require('../utils/formatterUtils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getfullsummary')
        .setDescription('Generates a summary of all work done since last tick.'),
    async execute(interaction) {
        const summary = getFullSummary();
        summary.shift();

        // Construct full summary string
        let summaryText = '';
        summary.forEach(systemSummary => {
            summaryText += systemSummary;
        });

        // Check to make sure we aren't above Discord's character limit
        if (summaryText.length > 2000) {
            summaryText = 'Full summary too long, please use individual system check command.';
        }

        await interaction.reply({ content: `${summaryText}`, ephemeral: true });
    },
};