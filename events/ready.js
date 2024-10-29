const { Events } = require('discord.js');
const { loadBackupFromFile } = require('../utils/backupUtils.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(bot) {
        loadBackupFromFile();
        console.log(`Connected as: ${bot.user.tag}`);
    },
};