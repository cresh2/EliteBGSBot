const { Events } = require('discord.js');
let { global } = require('../global.js')

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        console.log(message.content);
    },
};