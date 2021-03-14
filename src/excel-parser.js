import excelParser from "excel-parser";

export async function getWorksheets(sheetPath) {
    return new Promise((resolve, reject) => {
        excelParser.worksheets({ inFile: sheetPath }, (err, worksheets) => {
            if (err) reject(err);
            resolve(worksheets);
        })
    });
}

export async function getContent(sheetPath, worksheetId = 1) {

    const parseOptions = {
        inFile: sheetPath,
        worksheet: worksheetId,
        skipEmpty: true
    };

    return new Promise((resolve, reject) => {
        excelParser.parse(parseOptions, (err, records) => {
            if (err) reject(err);
            resolve(records);
        });
    });

}

// converting raw string matrix to actual objects with email and custom properties
export function mapRecords(records) {

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