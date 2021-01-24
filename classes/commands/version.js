const { LogEvent, LogError } = require('../logger');
const version = require('../../config.json').version;

function patch() {
    switch (version.patch) {
        default:
        case 0:
            return '';
        
        case 1:
            return ' - alpha';
        
        case 2:
            return ' - beta';
    }
}

exports.run = (client, message, args) => {
    LogEvent(`${message.author.tag} issued bot command ${message.content}.`);
    message.channel.send(`Current version: ${version.major}.${version.minor}${patch()}`).catch(error => LogError(error));
};

exports.help = {
    name: 'version'
};