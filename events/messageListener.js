const { Events } = require('discord.js');
let { global } = require('../global.js');
const { getFullSummary, getSystemSummary, checkForReset, parseBGSLog } = require('../utils/parseUtils.js');

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
            global.erroredLogs = [];
        } else if (message.content.includes('\u{1F551} `Date:`')) {
            try {
                parseBGSLog(message.content);
            } catch (error) {
                global.erroredLogs.push([message.id, error]);
            }
        }
    },
};