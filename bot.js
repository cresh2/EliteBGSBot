//https://discordapp.com/oauth2/authorize?&client_id=1038218491339218965&scope=bot&permissions=76800
require('dotenv').config();

const {Client, GatewayIntentBits} = require('discord.js');



//var logger = require('winston');

//var auth = require('./auth.json');

var authorizedUsers = [];
var targetSystems = [];

const newObjectiveKeywords = ["brief", "briefing", "New Orders", "Orders"];


// Configure logger settings

/*logger.remove(logger.transports.Console);

logger.add(new logger.transports.Console, {
colorize: true});

logger.level = 'debug';*/

// Initialize Discord Bot
    
var bot = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences]}
    
//token: auth.token,
    
//autorun: true
    
);

//bot.login(auth.token);
    
bot.on('ready', () => {
    
console.log('Connected');
    
console.log('Logged in as: ');
    
console.log(`${bot.user.tag}`);
});

//bot.login(process.env.TOKEN);
/*
// Helper to check if the message is updating the BGS objective
function checkForNewObjectives(messagetext) {
    for (const phrase of newObjectiveKeywords) {
        if (messagetext.includes(phrase)) {
            return true;
        }
    }
}

// Updates the objectives
function updateObjectives(messagetext) {
    var lines = messagetext.split('\n');
    for (const line of lines) {

    }
}
*/


bot.on('message', msg => {
    console.log(msg.content);
    if (msg.content === "ping") {
      msg.reply("pong");
    }
});

/*bot.on('message', function (user, userID, channelID, message, evt) {

    // Our bot needs to know if it will execute a command
    
    // It will listen for messages that will start with `!`
    // 332846508888031232 - BGSBot userID

    // Administration commands

    // Sets new goals
    //if (checkForNewObjectives(message)) {
    //    updateObjectives(message);
    //}
    

    console.log(message);



    if (message.substring(0, 1) == '!') {
        
    
        var args = message.substring(1).split(' ');
    
        var cmd = args[0];
    
    
        args = args.splice(1);
    
        switch(cmd) {
    
            // !ping
    
            case 'ping':
    
                bot.sendMessage({
    
                    to: channelID,
    
                    message: 'Pong!'
    
                });
    
            break;
    
            // Just add any case commands if you want to..
    
         }
    
    }
});*/

bot.login(process.env.TOKEN);