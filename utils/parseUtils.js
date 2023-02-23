let { global } = require('../global.js');

exports.getSystemSummary = (system) => { 
    const systemSummary = global.summary.get(system);
    if (systemSummary === undefined) {
        return 'The system you entered does not have any logged work.'
    } else {
        // Needs completing
        return true
    }
}

exports.getFullSummary = () => {
    return true;
}

