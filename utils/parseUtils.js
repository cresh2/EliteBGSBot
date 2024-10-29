let { global } = require('../global.js');

exports.checkForReset = (message) => {
    // Make sure the message is from BGSBot and is the tick notification
    if (message.author.id == '332846508888031232' && message.embeds.length != 0) {
        return true;
    }

    return false;
};

exports.parseBGSLog = (log, logType) => {
    let targets;
    // Each log has different ways to get the targets list
    switch (logType) {
        case 0:
            targets = log.split('\u{1F310} `Target:`');
            break;
        case 1:
            targets = log.split('**Target:**');
            break;
        case 2:
            targets = log.split('\n');
            break;
    }
    targets.shift();

    // If there was only one entry in targets then we will have nothing to work with, so error out.
    if (targets.length < 1) {
        throw new Error('No target');
    }

    targets.forEach(target => {
        const description = target.split('\n', 2);

        let systemAndFaction;
        let summaryLine;
        let systemAndFactionString;

        // parsing the system and faction is unique for each log type
        switch (logType) {
            case 0:
                systemAndFaction = description[0].trim().split(',');
                summaryLine = description[1].split('\u{1F4DC} `Summary:`')[1];
                break;
            case 1:
                systemAndFaction = description[0].trim().split(',');
                summaryLine = description[1].split('**Summary:**')[1];
                break;
            case 2:
                systemAndFactionString = description[0].trim().split(':')[0];
                systemAndFaction = [systemAndFactionString.split('**')[1], systemAndFactionString.split('**')[3]];
                summaryLine = description[0].split('**:')[1].trim();

                // Must remove trailing semicolon to parse correctly
                if (summaryLine[summaryLine.length - 1] === ';') {
                    summaryLine = summaryLine.substr(0, summaryLine.length - 1);
                }
                break;
        }
        let factionWork;

        // Check and see whether we need to create a system and/or faction entry
        if (global.summary.has(systemAndFaction[0].toUpperCase().trim())) {
            let system = global.summary.get(systemAndFaction[0].toUpperCase().trim());

            // Create summary for a new faction if needed
            if (!system.has(systemAndFaction[1].trim())) {
                factionWork = Array(global.bgsActionAmount);
                factionWork.fill(0);
                system.set(systemAndFaction[1].trim(), factionWork);

                try {
                    parseSummaryLine(summaryLine, factionWork);
                } catch (error) {
                    system.delete(systemAndFaction[1].trim());
                    throw error;
                }
            } else {
                factionWork = system.get(systemAndFaction[1].trim());
                parseSummaryLine(summaryLine, factionWork);
            }
        } else {
            let system = new Map();
            factionWork = Array(global.bgsActionAmount);

            factionWork.fill(0);
            system.set(systemAndFaction[1].trim(), factionWork);
            global.summary.set(systemAndFaction[0].toUpperCase().trim(), system);

            try {
                parseSummaryLine(summaryLine, factionWork);
            } catch (error) {
                global.summary.delete(systemAndFaction[0].toUpperCase().trim());
                throw error;
            }
        }
    });
};

function parseSummaryLine(summaryLine, factionWork) {
    let actions = summaryLine.replace(/(\d+),(\d+)/g, '$1.$2').split(';');
    for (let index = 0; index < actions.length; index++) {
        // First need to unpack CZ actions, otherwise we can parse as normal
        if (actions[index].includes('CZ') && actions[index].includes(',')) {
            let CZActions = actions[index].split(',');
            actions = actions.concat(CZActions);
        } else {
            const splitEntry = actions[index].split(':');
            let arrayPosition = global.actionSimple.get(splitEntry[0].trim());
            const numRegex = /(\s*|-)\d+\.*\d*/g;
            const complexRegex = /[A-z?]+/g;

            // Check and see if the action was an easy-to-parse action or secondary part of an action
            if (arrayPosition == undefined && splitEntry.length != 1) {
                // There will potentially be 2 quantities for each action, and always a min of 1
                const quantities = splitEntry[1].match(numRegex);
                const actionSubtype = (splitEntry[1].match(complexRegex))[0];
                arrayPosition = global.actionComplex.get(actionSubtype);

                // Check to make sure log is valid
                if ((quantities == undefined) || (actionSubtype == undefined) || (arrayPosition == undefined)) {
                    throw new Error('Invalid Summary Line Item');
                }

                // Only if the action has 2 quantities
                if (splitEntry[1].includes('+') || splitEntry[1].includes(',')) {
                    if (splitEntry[1].includes('OPTS')) {
                        factionWork[global.bgsActionAmount - 1] += Number(quantities[1]);
                    } else {
                        factionWork[arrayPosition + 1] += Number(quantities[1]);
                    }
                }

                factionWork[arrayPosition] += Number(quantities[0]);
            } else if (splitEntry.length == 1) {
                const actionSubtype = (splitEntry[0].match(complexRegex))[0];
                arrayPosition = global.actionComplex.get(actionSubtype);

                if (arrayPosition == undefined || actionSubtype == undefined) {
                    throw new Error('Invalid Summary Line Item');
                }

                factionWork[arrayPosition] += Number(splitEntry[0].match(numRegex)[0]);
            } else {
                const quantities = splitEntry[1].match(numRegex);

                // If S&R or sold items, need to update profit
                if ((arrayPosition == 21 || arrayPosition == 25) && (quantities.length > 1)) {
                    factionWork[arrayPosition + 1] += Number(quantities[1]);
                }

                factionWork[arrayPosition] += Number(quantities[0]);
            }
        }
    }
}

