const promisify = require('promisify-node');
const xml2js = require('xml2js');
const fs = promisify(require('fs'), undefined, true);
const path = require('path');
const escape = require('escape-html');
const dateformat = require('dateformat');
const styles = require('./styles');

promisify(xml2js.Parser.prototype);

function getPathForContact(name) {
    return `out/${name}.html`;
}
function writeHeader(name) {
    return fs.appendFile(name, `<html><head><style>${styles}</style></head><body><div class="container">`);
}

function writeFooter(name) {
    return fs.appendFile(name, '</div></body></html>')
}

async function begin() {
    var parser = new xml2js.Parser();
    const smses = await fs.readFile(process.argv[2]).then(parser.parseString).then(result => result.smses);
    fs.stat()
    await fs.mkdir('out');
    const prevDates = {};

    for (let sms of smses.sms) {
        sms = sms['$'];
        let contact_name = sms.contact_name;
        if(contact_name === '(Unknown)') contact_name = sms.address; 
        if (!prevDates.hasOwnProperty(contact_name)) {
            prevDates[contact_name] = new Date(0);
            await writeHeader(getPathForContact(contact_name));
        }
        let nextDate = new Date(Number(sms.date));
        const diff = (nextDate - prevDates[contact_name]) / 1000 / 60 / 60;
        if (diff > 24) {
            await fs.appendFile(getPathForContact(contact_name), `<h5 class="date">${dateformat(nextDate, "dd/mm/yyyy")}</h5>`);
        }
        if (diff > 3) {
            await fs.appendFile(getPathForContact(contact_name), `<h6 class="time">${dateformat(nextDate, "HH:MM")}</h6>`);
            prevDates[contact_name] = nextDate;
        }
        await fs.appendFile(getPathForContact(contact_name), `<div class="${sms.type === "1" ? "from" : "to"}"><span>${escape(sms.body)}</span></div>`);
    }
    for (let contact_name of Object.keys(prevDates)) {
        writeFooter(getPathForContact(contact_name));
    }
}

begin().then(() => {

});
