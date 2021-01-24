const path = require('path');
const fs   = require('fs');

class Template {
    constructor() {
        this.tdata = {};
    }

    add(id, value) {
        this.tdata[id] = value;
    }

    parseHTML(filename) {
        var filedata = fs.readFileSync(filename, { encoding: 'utf-8' });

        Object.entries(this.tdata).forEach(([k, v]) => {
            filedata = filedata.replace(`<% ${k} %>`, v);
        });

        return filedata;
    }

    parseTemplate(template, name = null) {
        let filename = (name === null)
            ? path.join(__dirname, 'website', `${template}.html`)
            : path.join(__dirname, 'website', 'templates', template, `${name}.html`);
            
        return this.parseHTML(filename);
    }
}

exports.create = () => new Template();