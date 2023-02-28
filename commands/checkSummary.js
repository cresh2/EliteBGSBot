const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getSystemSummary } = require('../utils/formatterUtils.js');
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
        //await interaction.deferReply({ ephemeral: true });
        const targetSystem = interaction.options.getString('system');
        const systemSummary = getSystemSummary(targetSystem);
        await interaction.reply({ content: `${systemSummary}`, ephemeral: true });
    },
};