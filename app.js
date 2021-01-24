const { LogError, LogEvent, LogWarn } = require('./classes/logger');

const template  = require('./classes/template');
const normalize = require('normalize-text');
const config    = require('./config.json');
const parser    = require('body-parser');
const discord   = require('discord.js');
const express   = require('express');
const sqlite    = require('sqlite3');
const enmap     = require('enmap');
const path      = require('path');
const fs        = require('fs');

const database  = new sqlite.Database(path.join(__dirname, 'bot.db'));
const client    = new discord.Client({ autoReconnect: true });
const webapp    = express();

/*
 * ExpressJS Web Server
 */

webapp.disable('x-powered-by');
webapp.use(parser.urlencoded({ extended: true }));
webapp.use('/assets', express.static(path.join(__dirname, 'classes', 'website', 'assets')));

webapp.use((req, res, next) => {
    Object.entries(config.headers)
        .forEach(([k, v]) => res.set(k, v));

    next();
});

webapp.get('/', (req, res) => {
    let thead = template.create();
    let tbody = template.create();
    let index = template.create();

    thead.add('guild-name', 'Test Guild');
    thead.add('page-name', 'Homepage');

    tbody.add('header', 'This is a header.');
    tbody.add('body', 'This is the body.');
    tbody.add('footer', 'This is a footer.');

    index.add('header', thead.parseTemplate('index', 'header'));
    index.add('body',   tbody.parseTemplate('index', 'body'));

    res.send(index.parseTemplate('index'));
});

webapp.listen(config.port, config.host, () => {
    console.log(`Running web server at http://${config.host}:${config.port}`)
}).on('error', (error) => console.error(error));

/*
 * Discord Client Bot
 */

client.commands = new enmap();
client.on('ready', () => {
    fs.readdir(path.join(__dirname, 'classes', 'commands'), (err, files) => {
        if (error) LogError(error);

        files.forEach(file => {
            if (!file.endsWith('.js'))
                return;
            
            let props = require(path.join(__dirname, 'classes', 'commands', file));
            let cmdname = file.split('.')[0];

            client.commands.set(cmdname, props);
        });
    });

    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('disconnect', () => {});
client.on('invalidated', () => {});

client.on('rateLimit', rateLimitInfo => {
    // rateLimitInfo.timeout - timeout in milliseconds
    // rateLimitInfo.limit - number of requests that can be made
    // rateLimitInfo.method - HTTP method used for request
    // rateLimitInfo.path - URL path used for request
    // rateLimitInfo.route - Route used for request
});

client.on('guildUnavailable', guild => {});
client.on('guildUpdate', (original, updated) => {});
client.on('presenceUpdate', (original, updated) => {});

client.on('error',  error => LogError(error));
client.on('warn', warning => LogWarn(warning));

client.on('guildBanAdd', (guild, user) => {});
client.on('guildBanRemove', (guild, user) => {});

client.on('messageDelete', message => {});
client.on('messageUpdate', (original, updated) => {});

client.on('messageReactionAdd', (reaction, user) => {});
client.on('messageReactionRemove', (reaction, user) => {});
client.on('messageReactionRemoveAll', message => {});
client.on('messageReactionRemoveEmoji', reaction => {});

client.on('guildMemberAdd', member => {});
client.on('guildMemberAvailable', member => {});
client.on('guildMemberRemove', member => {});
client.on('guildMemberSpeaking', member => {});
client.on('guildMemberUpdate', (original, updated) => {});

client.on('roleCreate', role => {});
client.on('roleDelete', role => {});
client.on('roleUpdate', (original, updated) => {});

client.on('emojiCreate', emoji => {});
client.on('emojiDelete', emoji => {});
client.on('emojiUpdate', (original, updated) => {});

client.on('inviteCreate', invite => {});
client.on('inviteDelete', invite => {});

client.on('message', message => {});
//client.login('');