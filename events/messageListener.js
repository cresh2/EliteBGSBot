const { Events } = require('discord.js');
let { global } = require('../global.js');
const { getFullSummary, getSystemSummary, checkForReset } = require('../utils/parseUtils.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        if (checkForReset) {
            const fullSummary = getFullSummary();
            fullSummary.array.forEach(element => {
                message.channel.send(element);
            });
            global.summary.clear();
        } else if (false) {

        }
        
        console.log(message.content);
    },
};