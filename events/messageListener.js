const { Events } = require('discord.js');
let { global } = require('../global.js');
const { getFullSummary, getSystemSummary, checkForReset } = require('../utils/parseUtils.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        // Check if we are resetting or dealing with a log
        if (checkForReset(message)) {
            const fullSummary = getFullSummary();
            fullSummary.forEach(element => {
                message.channel.send(element);
            });
            global.summary.clear();
        } else if (message.content.includes(':clock2: `Date:`')) {

        }
        
        //console.log(message.content);
    },
};