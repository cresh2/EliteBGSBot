const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getFullSummary, getSystemSummary } = require('../utils/parseUtils.js');
let { global } = require('../global.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checksummary')
        .setDescription('Generates a summary of all work done in a system since last tick.')
        .addStringOption(option =>
            option.setName('system')
                .setDescription("The specific system to do a summary for.")
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const targetSystem = interaction.options.getString('system');
        console.log(getSystemSummary(targetSystem));
        await interaction.editReply('Pong!');
    },
};