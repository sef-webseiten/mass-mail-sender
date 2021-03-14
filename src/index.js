import { program } from 'commander/esm.mjs';
import fs from "fs";
import readline from "readline";
import Confirm from 'prompt-confirm';
import { parseMail } from "./mail-parser.js"
import { getContent, getWorksheets, mapRecords } from './excel-parser.js';
import { closeConnection, sendMail } from './mail-client.js';

program.option("-s, --sheet <path>", "Excel sheet input path");
program.option("-t, --test", "Send test email to sender");
program.requiredOption("-m, --mail <path>", "Mail input path");
program.parse(process.argv);

const options = program.opts();
const sheetPath = options.sheet;
const mailPath = options.mail;
const test = options.test;

// check if files exist
if ((!test && !fs.existsSync(sheetPath)) || !fs.existsSync(mailPath))
    throw new Error("Cannot open files")

// read mail content
let mail = parseMail(mailPath);

(async () => {

    if (test) {
        console.info(`Sending test email to ${process.env.FROM_MAIL}`);
        await sendMail(process.env.FROM_MAIL, mail);
        return;
    }

    const worksheets = await getWorksheets(sheetPath);

    console.info(`Found ${worksheets.length} worksheet(s), using "${worksheets[0].name}"`);
    console.info("Now parsing records");

    const records = mapRecords(await getContent(sheetPath));

    console.info(`Found ${records.length} record(s)`)
    console.info(`These is/are the first ${records.length >= 5 ? 5 : records.length} record(s)`, records.slice(0, 5));

    const prompt = await (new Confirm('Proceed?')).run();

    if (!prompt) return console.info("Quitting")

    for (const record of records) {

        console.time(`Sending mail to ${record.email}`);

        // create a copy of the mail template
        const customMail = JSON.parse(JSON.stringify(mail));

        // replace custom properties in subject
        for (const property in record)
            customMail.subject = customMail.subject.split(`[${property}]`).join(record[property]);

        // replace custom properties in content
        for (const property in record)
            customMail.content = customMail.content.split(`[${property}]`).join(record[property]);

        try {
            await sendMail(record.email, customMail)
        } catch (e) {
            console.log(`Error sending mail to ${record.email}`)
        }

        console.timeEnd(`Sending mail to ${record.email}`)

    }

    console.info("Finished all emails");

    closeConnection();

    console.info("Closing connection - good bye! ")

})();
