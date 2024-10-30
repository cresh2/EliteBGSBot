let { global } = require('../global.js');
const fs = require('fs');


exports.saveBackupToFile = () => {
    // Save the date so we know when the backup was made
    let backup = Date.now().toString() + ',';

    // Only the vital(work in each system) imformation needs to be saved
    for (let [system, systemWork] of global.summary) {
        backup += `${system}:`;
        for (let [faction, factionWork] of systemWork) {
            backup += `${faction}=${factionWork.join('+')}`+'!';
        }
        backup = backup.slice(0,-1) + ';';
    }

    backup = backup.slice(0, -1);

    // While it shouldn't happen, we want to error out if we can't write the file
    fs.writeFile(require.resolve('../utils/backupSummary.txt'), backup,
        (err) => {
            if (err) throw new Error('Failed to create backup.');
    });
}

exports.loadBackupFromFile = () => {
    // Again, erroring out shouldn't happen
    let backupFile;
    try {
        backupFile = fs.readFileSync(require.resolve('../utils/backupSummary.txt'), 'utf-8');
    } catch (err) {
        throw new Error(err);
    }

    const backup = backupFile.split(',');
    const time = backup[0]*1.0;

    // We only want to use the back up if it is less than 24 hours old
    if (Date.now() - time <= 86400000) {
        const summary = backup[1];

        // Gets us the system name and sends the factions and work to get unwrapped
        summary.split(';').forEach(systemSummaryLine => {
            const systemSummary = systemSummaryLine.split(':');
            const system = systemSummary[0];
            const systemWork = systemSummary[1];
            let systemWorkMap = new Map();

            // Unwraps the faction and work done and saves everything
            systemWork.split('!').forEach(factionSummaryLine => {
                const faction = factionSummaryLine.split('=')[0];
                const factionWork = factionSummaryLine.split('=')[1];
                systemWorkMap.set(faction, factionWork.split('+'));
            });

            global.summary.set(system, systemWorkMap);
        });

    }
}