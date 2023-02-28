let { global } = require('../global.js');

exports.checkForReset = (message) => {
    // Make sure the message is from BGSBot and is the tick notification
    if (message.author.id == '332846508888031232' && message.embeds.length != 0) {
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

exports.parseBGSLog = (log) => {
    let targets = log.split('\u{1F310} `Target:`');
    targets.shift();

    targets.forEach(target => {
        const description = target.split('\n', 2);
        const systemAndFaction = description[0].trim().split(',');
        let factionWork;

        // Check and see whether we need to create a system and/or faction entry
        if (global.summary.has(systemAndFaction[0])) {
            let system = global.summary.get(systemAndFaction[0]);
            if (!system.has(systemAndFaction[1])) {
                factionWork = Array(global.bgsActionAmount);
                factionWork.fill(0);
                system.set(systemAndFaction[1].trim(), factionWork);
            } else {
                factionWork = system.get(systemAndFaction[1]);
            }
        } else {
            let system = new Map();
            factionWork = Array(global.bgsActionAmount);
            
            factionWork.fill(0);
            system.set(systemAndFaction[1].trim(), factionWork);
            global.summary.set(systemAndFaction[0].trim(), system)
        }

        const summaryLine = description[1].split('\u{1F4DC} `Summary:`')[1];
        parseSummaryLine(summaryLine, factionWork);
    });
}

function parseSummaryLine(summaryLine, factionWork) {
    const actions = summaryLine.split(',');
    actions.forEach(actionEntry => {
        const splitEntry = actionEntry.split(':');
        let arrayPosition = global.actionSimple.get(splitEntry[0].trim());
        const numRegex = /\d+\.*\d*/g;
        const complexRegex = /[A-z?]+/g;

        // Check and see if the action was an easy-to-parse action
        if (arrayPosition == undefined) {
            // There will potentially be 2 quantities for each action, and always a min of 1
            const quantities = splitEntry[1].match(numRegex);
            const actionSubtype = (splitEntry[1].match(complexRegex))[0];
            arrayPosition = global.actionComplex.get(actionSubtype);

            // Check to make sure log is valid
            if ((quantities == undefined) || (actionSubtype == undefined) || (arrayPosition == undefined)) {
                throw new Error("Invalid log");
            }

            // Only if the action has 2 quantities
            if (splitEntry[1].includes('+')) {
                factionWork[global.bgsActionAmount - 1] += Number(quantities[1]);
            } else if (splitEntry[1].includes(',')) {
                factionWork[arrayPosition + 1] += Number(quantities[1]);
            } 

            factionWork[arrayPosition] += Number(quantities[0]);
        } else {
            factionWork[arrayPosition] += Number(splitEntry[1].match(numRegex)[0]);
        }
    });
}

