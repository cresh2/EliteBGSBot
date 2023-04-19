const { Events } = require('discord.js');
let { global } = require('../global.js');
const { checkForReset, parseBGSLog } = require('../utils/parseUtils.js');
const { getFullSummary } = require('../utils/formatterUtils.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        // Check if we are resetting or dealing with a log
        if (checkForReset(message)) {
            let fullSummary = getFullSummary();
            fullSummary.forEach(element => {
                message.channel.send(element);
            });
            global.summary.clear();
            global.erroredLogs = [];
        } else if (message.content.includes('\u{1F551} `Date:`')) {
            try {
                parseBGSLog(message.content);
                message.react('\u{2705}');
            } catch (error) {
                global.erroredLogs.push([message.id, error]);
                message.react('\u{274C}');
                message.channel.send('Failed to parse log, make sure you are using the most up-to-date version of Hekateh\'s BGS tool.');
            }
        } else if (message.content.includes('Date:') || message.content.includes('Target:')) {
            global.erroredLogs.push([message.id, 'Invalid log']);
            message.react('\u{274C}');
            message.channel.send('Failed to parse log, make sure you are using the most up-to-date version of Hekateh\'s BGS tool.');
        }
    },
};