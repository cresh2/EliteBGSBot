let global = {
    actionType : new Map([
        ['INF' , 0],
        ['Kills' , 1],
        ['Bounties' , 2],
        ['Bonds' , 3],
        ['Explo' , 4],
        ['Trade' , 5],
    ]),
    actionSubtype : new Map([
        ['INT' , 6],
        ['SCT' , 7], 
        ['Ground' , 8],
        ['Ship' , 9],
        ['xLG' , 10],
        ['xMG' , 11],
        ['xHG' , 12],
        ['xVHG', 13],
        ['x?G' , 14],
        ['xLS' , 15],
        ['xMS' , 16],
        ['xHS' , 17],
        ['xVHS', 18],
        ['x?S' , 19],
        ['x?A' , 20],
    ]),
    bgsActionAmount : 22,
    summary : new Map()
};
module.exports = { global };