import { program } from 'commander/esm.mjs';
import fs from "fs";
import readline from "readline";
import Confirm from 'prompt-confirm';
import {parseMail} from "./mail-parser.js"
import { getContent, getWorksheets, mapRecords } from './excel-parser.js';

program.requiredOption("-s, --sheet <path>", "Excel sheet input path");
program.requiredOption("-m, --mail <path>", "Mail input path");
program.parse(process.argv);

const options = program.opts();
const sheetPath = options.sheet;
const mailPath = options.mail;

// check if files exist
if (!fs.existsSync(sheetPath) || !fs.existsSync(mailPath))
    throw new Error("Cannot open files")

// read mail content
let mail = parseMail(mailPath);

(async () => {

    const worksheets = await getWorksheets(sheetPath);

    console.info(`Found ${worksheets.length} worksheet(s), using "${worksheets[0].name}"`);
    console.info("Now parsing records");

    const records = mapRecords(await getContent(sheetPath));

    console.info(`Found ${records.length} record(s)`)
    console.info(`These is/are the first ${records.length >= 5 ? 5 : records.length} record(s)`, records.slice(0, 5));

    const prompt = await (new Confirm('Proceed?')).run();

    if (!prompt) return console.info("Quitting")

})();
