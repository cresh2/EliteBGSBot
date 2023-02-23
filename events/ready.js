const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(bot) {
        console.log(`Connected as: ${bot.user.tag}`);
    },
};