let { global } = require('../global.js');

exports.checkForReset = (message) => {
    if (message.author == 332846508888031232 && message.embeds.length != 0) {
        console.log("time to reset");
        return true;
    }

    return false;
}

exports.getSystemSummary = (system) => { 
    const systemSummary = global.summary.get(system);
    if (systemSummary === undefined) {
        return 'The system you entered does not have any logged work.';
    } else {
        // Needs completing
        return true;
    }
}

exports.getFullSummary = () => {
    if (global.summary.size == 0) {
        return ['There has not been any work done since last tick.'];
    }
    return true;
}

