const { Events } = require('discord.js');
let { global } = require('../global.js')

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(bot) {
        //global.messageId++;
        console.log(`Connected as: ${bot.user.tag}`);
    },
};