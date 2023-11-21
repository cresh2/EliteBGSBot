const { SlashCommandBuilder } = require('discord.js');
const { getFullSummary } = require('../utils/formatterUtils.js');
let { global } = require('../global.js');
const { clearTimeout } = require('timers');

let repeat = false;
let timeoutId = -1;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getticksummary')
        .setDescription('Generates a summary of all work done since last tick and allows for automatic posts in this channel.')
        .addStringOption(option =>
            option.setName('repeat')
                .setDescription('Should the summary be posted at this time until stopped? No will stop it from posting automatically.')
                .setRequired(true)
                .addChoices(
                    { name: 'Yes', value:'Yes' },
                    { name: 'No', value:'No' },
                )),
    async execute(interaction) {
        // await interaction.deferReply({ ephemeral: true });
        repeat = interaction.options.getString('repeat') === 'Yes';
        let channel = interaction.channel;
        if (repeat) {
            await interaction.reply({ content: 'The summary will be automatically posted at this time each day.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'The summary will not be automatically posted at this time each day.', ephemeral: true });
        }
        sendFullSummary(repeat, channel);
    },
};

function sendFullSummary(channel) {
    let fullSummary = getFullSummary();
    fullSummary.forEach(element => {
        channel.send(element);
    });
    global.summary.clear();
    global.erroredLogs = [];
    if (repeat) {
        timeoutId = setTimeout(sendFullSummary, 86400000, channel);
    } else if (timeoutId != -1) {
        clearTimeout(timeoutId);
    }
}

