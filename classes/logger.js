const process = require('process'); // We will use the process object for writing directly to the standard error and standard output filestreams.
const fs      = require('fs');      // Speaking of filestreams, we will also want to be able to log warning and error messages for debugging.

/**
 * This function will serve as an interface for the different types of logs that we can write to.
 * 
 * @param {string} filename 
 * @param {string} contents
 * 
 * @since 0.1.1
 */
function write(filename, contents) {
    try {

        // Create a local variable to store the current ISO-8601 formatted timestamp.
        let curtime = new Date(Date.now()).toISOString();

        // Write to the end of the given file with UTF-8 encoding support for special characters.
        fs.appendFileSync(filename, `[${curtime}] ${contents}\n`, { encoding: 'utf-8' });

    } catch (error) {

        // If something went wrong with the logging process then we will notify of this via the console by writing to the standard error filestream.
        process.stderr.write(`${error}\n`);
    }
}

exports.LogError = contents => write('./logs/error.log', contents); // We will use this to log any critical error messages such as program crashes.
exports.LogWarn  = contents => write('./logs/warn.log',  contents); // We will use this to log any non-critical error messages such as runtime faults.
exports.LogEvent = contents => write('./logs/event.log', contents); // We will use this to log any event calls from the Discord portion of the bot.
exports.LogWeb   = contents => write('./logs/web.log',   contents); // We will use this to log any requests to the website portion of the bot.