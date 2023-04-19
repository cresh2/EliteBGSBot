let { global } = require('../global.js');

exports.getSystemSummary = (system) => {
    const systemSummary = global.summary.get(system);

    if (systemSummary === undefined) {
        return 'The system you entered does not have any logged work.';
    } else {
        return formatSystemSummary(system, systemSummary);
    }
};

exports.getFullSummary = () => {
    if (global.summary.size == 0) {
        return ['There has not been any work done since last tick.'];
    } else {
        let summaries = ['***After-tick summary***\n'];
        global.summary.forEach((systemSummary, system) => {
            summaries.push(formatSystemSummary(system, systemSummary));
        });
        return summaries;
    }
};

function formatSystemSummary(system, systemSummary) {
    let summary = `**Summary for ${system}:**\n`;

    // Go through each faction and list all the categories that had work done.
    systemSummary.forEach((factionWork, faction) => {
        summary += `${faction}:\n\`\`\`\n`;
        for (let index = 0; index < global.bgsActionAmount; index++) {
            if (factionWork[index] > 0) {
                summary += factionWork[index] + global.actionSummaries[index];

                // We want to be sure to include that the profit was unknown
                if ((index == 21 || index == 25) && factionWork[index + 1] == 0) {
                    summary += 'unknown profit.\n';
                }
            }
        }
        summary += '```\n';
    });

    return summary;
}