import { program } from 'commander/esm.mjs';
import fs from "fs";
import excelParser from "excel-parser";
import readline from "readline";
import Confirm from 'prompt-confirm';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

program.requiredOption("-s, --sheet <path>", "Excel sheet input path");
program.requiredOption("-m, --mail <path>", "Mail input path");
program.parse(process.argv);

const options = program.opts();
const sheetPath = options.sheet;
const mailPath = options.mail;

let mailContent = "", mailSubject = "";

// check if files exist
try {
    fs.existsSync(sheetPath);
    console.log("All input files exist");

    console.log("Reading mail content");

    const content = fs.readFileSync(mailPath, 'utf-8').split(/\r?\n/);

    mailContent = content[1];
    mailSubject = content[0];

    console.log(`Using mail with subject "${mailSubject}"`)

} catch (e) {
    console.error("Connot find file", e)
}

// parse worksheets
excelParser.worksheets({ inFile: sheetPath }, (err, worksheets) => {
    if (err) return console.error("Error reading worksheet", err);

    console.log(`Found ${worksheets.length} worksheets, using ${worksheets[0].name}`);
    console.log("Now parsing records");

    const parseOptions = {
        inFile: sheetPath,
        worksheet: 1,
        skipEmpty: true
    };

    excelParser.parse(parseOptions, async (err, records) => {
        if (err) return console.error(err);

        console.log(`Found ${records.length - 1} record(s)`)

        records = mapRecords(records);

        console.log(`These is/are the first ${records.length >= 5 ? 5 : records.length} record(s)`, records.slice(0, 5));

        const prompt = await (new Confirm('Proceed?')).run();

        if (!prompt) return console.log("Quitting")

    });


});

// converting raw string matrix to actual objects with email and custom properties
function mapRecords(records) {

    const output = [], options = records[0];

    records.slice(1, records.length).forEach(record => {

        const mappedRecord = {};

        options.forEach((option, index) => {
            if (index === 0)
                mappedRecord.email = record[0] + record[1];
            else if (index > 1)
                mappedRecord[option] = record[index];
        });

        output.push(mappedRecord);

    });

    return output;

}