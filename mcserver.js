const Discord = require('discord.js');
const client = new Discord.Client();
client.login('your token');

var request = require('request');
var mcCommand = '/minecraft'; // Command for triggering
var mcIP = '123.123.123.123'; // Your MC server IP or hostname address
var mcPort = 25565; // Your MC server port (25565 is the default)

var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;

function getStatus() {
    return new Promise((resolve, reject) => {
        request(url, function(err, response, body) {
            var status;
            if(err) {
                console.log(err);
                reject(new Error('API error'));
            } else {
                body = JSON.parse(body);
                if(body.online) {
                    status = (body.players.now || '0') + ' of ' + body.players.max;
                } else {
                    status = 'offline';
                }
                resolve(status);
            }
        });

    })
}

async function interval() {
    client.user.setPresence({ game: { name: await getStatus() }, status: 'online' })
        .then(console.log)
        .catch(console.error);
}

client.on('message', async message => {
    if (message.content === mcCommand) {
        message.reply(await getStatus());
    }
});

client.on('ready', async () => {
    setInterval(interval, 2.5 * 60 * 1000) // Updates every 2.5 minutes (API caches 5 minutes)
    interval();
});
